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
        DEV_SERVER   = "ubuntu@13.217.4.5"
        QA_SERVER    = "ubuntu@52.90.217.218"
        GIT_BRANCH = """${sh(
                returnStdout: true,
                script: 'echo "\$GIT_BRANCH" | sed "s|origin/||"'
            ).trim()}""" 

        SLACK_URL  = credentials("PLANZO_SLACK_WEBHOOK")
        MAPS_KEY   = credentials('VITE_GOOGLE_MAPS_API_KEY')
        STRIPE_KEY = credentials('VITE_STRIPE_PUBLISHABLE_KEY')
        DB_USER    = credentials('POSTGRES_USER')
        DB_PASS    = credentials('POSTGRES_PASSWORD')
        DB_NAME    = credentials('POSTGRES_DB')
    }

    stages {
        stage('Initialize') {
            parallel {
                stage('Setup Environment') {
                    steps {
                        script {
                            sh "docker system prune -f --volumes || true"
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
                stage('Identify Build') {
                    steps {
                        script {
                            currentBuild.displayName = "#${env.BUILD_NUMBER} - ${env.GIT_BRANCH}"
                            currentBuild.description = "Deployed to ${env.DEPLOY_ENV}"
                        }
                    }
                }
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Parallel Build & Test') {
            failFast true
            parallel {
            
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
        }
        }
        stage('Approval & Notification') {
            parallel {
                stage('Input Approval') {
                    when { expression { return (env.GIT_BRANCH == 'main' || env.GIT_BRANCH == 'master') } }
                    steps {
                        input message: "Proceed with deployment to ${env.DEPLOY_ENV}?",
                              ok: "Deploy Now",
                              submitter: "admin,kevin,jenkins_capstone"
                    }
                }
                stage('Notify Slack for Approval') {
                    when { expression { return (env.GIT_BRANCH == 'main') } }
                    steps {
                        sh """
                            curl -X POST -H 'Content-type: application/json' \
                            --data '{"text":"⚠️ *Build #${env.BUILD_NUMBER} Awaiting Approval*\\n*Approve here:* ${env.BUILD_URL}input"}' \
                            ${env.SLACK_URL}
                        """
                    }
                }
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

        stage('Artifact Archiving') {
            steps {
                // ARTIFACT ARCHIVING: Save compose file and docker logs for debugging
                sh "docker logs ${env.DOCKER_IMAGE} > build-log.txt || true"
                archiveArtifacts artifacts: 'docker-compose.yml, build-log.txt', fingerprint: true
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