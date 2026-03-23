pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 8, unit: 'MINUTES')
    }

    environment {
        APP_NAME     = 'planzo-web'
        DOCKER_IMAGE = "${env.APP_NAME}:latest"
        DEV_SERVER   = "ubuntu@172.31.15.225"
        QA_SERVER    = "ubuntu@172.31.3.1"
        GIT_BRANCH = """${sh(
                returnStdout: true,
                script: 'echo "\$GIT_BRANCH" | sed "s|origin/||"'
            ).trim()}""" 

        // Corrected syntax for credentials (using = instead of :)
        SLACK_URL  = credentials("PLANZO_SLACK_WEBHOOK")
        MAPS_KEY   = credentials('VITE_GOOGLE_MAPS_API_KEY')
        STRIPE_KEY = credentials('VITE_STRIPE_PUBLISHABLE_KEY')
        DB_USER    = credentials('POSTGRES_USER')
        DB_PASS    = credentials('POSTGRES_PASSWORD')
        DB_NAME    = credentials('POSTGRES_DB')
    }

    stages {
        stage('Setup Environment') {
            steps {
                script {
                    // Logic for environment routing
                    if (env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master') {
                        env.DEPLOY_ENV = 'DEV'
                        env.TARGET_IP_ID = 'DEV_PUBLIC_IP'
                        env.TARGET_SERVER = "${env.DEV_SERVER}"
                    } else {
                        env.DEPLOY_ENV = 'QA'
                        env.TARGET_IP_ID = 'QA_PUBLIC_IP'
                        env.TARGET_SERVER = "${env.QA_SERVER}"
                    }
                }
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('TestRigor Smoke Test') {
            steps {
                sh '''
                #!/bin/bash
                    curl -X POST \
                    -H 'Content-type: application/json' \
                    -H 'auth-token: ed3b5a4b-c84e-48ac-9047-3035d86d6f6b' \
                    --data '{"forceCancelPreviousTesting":true,"storedValues":{"storedValueName1":"Value"}}' \
                    https://api.testrigor.com/api/v1/apps/MGx3fTfu2bbPSyiCC/retest

                    sleep 10

                    while true
                    do
                    echo " "
                    echo "==================================="
                    echo " Checking run status"
                    echo "==================================="
                    response=$(curl -i -o - -s -X GET 'https://api.testrigor.com/api/v1/apps/MGx3fTfu2bbPSyiCC/status' -H 'auth-token: ed3b5a4b-c84e-48ac-9047-3035d86d6f6b' -H 'Accept: application/json')
                    code=$(echo "$response" | grep HTTP |  awk '{print $2}')
                    body=$(echo "$response" | sed -n '/{/,/}/p')
                    echo "Status code: " $code
                    echo "Response: " $body
                    case $code in
                        4*|5*)
                        # 400 or 500 errors
                        echo "Error calling API"
                        exit 1
                        ;;
                        200)
                        # 200: successfully finished
                        echo "Test finished successfully"
                        exit 0
                        ;;
                        227|228)
                        # 227: New - 228: In progress
                        echo "Test is not finished yet"
                        ;;
                        229)
                        # 229: Canceled
                        echo "Test canceled"
                        exit 1
                        ;;
                        230)
                        # 230: Failed
                        echo "Test finished but failed"
                        exit 1
                        ;;
                        *)
                        echo "Unknown status"
                        exit 1
                        esac
                    sleep 10
                    done
                '''
            }
        }

        stage('Docker Build & Package') {
            steps {
                echo "=== Building Image === "
                sh """
                    docker build \
                    --build-arg VITE_GOOGLE_MAPS_API_KEY=${env.MAPS_KEY} \
                    --build-arg VITE_STRIPE_PUBLISHABLE_KEY=${env.STRIPE_KEY} \
                    -t ${env.DOCKER_IMAGE} .
                """
            }
        }

        stage('Remote Deploy') {
            steps {
                // Transfer Image & Compose file
                sh "docker save ${env.DOCKER_IMAGE} | ssh -o StrictHostKeyChecking=no ${env.TARGET_SERVER} 'docker load'"
                sh "scp -o StrictHostKeyChecking=no docker-compose.yml ${env.TARGET_SERVER}:~/docker-compose.yml"
                
                // Deploy with Health Check
                sh """
                    ssh -o StrictHostKeyChecking=no ${env.TARGET_SERVER} "
                        export POSTGRES_USER=${env.DB_USER}
                        export POSTGRES_PASSWORD=${env.DB_PASS}
                        export POSTGRES_DB=${env.DB_NAME}

                        docker compose up -d db
                        
                        echo 'Waiting for PostGIS health...'
                        until [ \\\$(docker inspect -f '{{.State.Health.Status}}' planzo-db) == 'healthy' ]; do 
                            sleep 2
                        done

                        docker compose up -d app
                        docker image prune -f
                    "
                """
            }
        }
    }

    post {
       success {
            script {
                // Dynamically fetch the actual IP using the ID stored in TARGET_IP_ID
                withCredentials([string(credentialsId: "${env.TARGET_IP_ID}", variable: 'ACTUAL_IP')]) {
                    sh """
                        curl -X POST -H 'Content-type: application/json' \
                        --data '{"text":"✅ *Build #${env.BUILD_NUMBER} Success* \\n*Env:* ${env.DEPLOY_ENV} \\n*URL:* http://${ACTUAL_IP}"}' \
                        ${env.SLACK_URL}
                    """
                }
            }
        }
        failure {
            sh """
                curl -X POST -H 'Content-type: application/json' \
                --data '{"text":"❌ *Build #${env.BUILD_NUMBER} FAILED* \\n*Branch:* ${env.GIT_BRANCH}"}' \
                ${env.SLACK_URL}
            """
        }
        always {
            script { 
                cleanWs()
                sh "docker rmi ${env.DOCKER_IMAGE} || true"
                sh "docker image prune -f"
            }
        }
    }
}