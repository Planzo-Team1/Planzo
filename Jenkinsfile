pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 8, unit: 'MINUTES')
    }

    environment {
        APP_NAME     = 'planzo-web'
        DOCKER_IMAGE = "${APP_NAME}:latest"
        // Base Servers
        DEV_SERVER   = "ubuntu@172.31.15.225"
        QA_SERVER    = "ubuntu@172.31.3.1"
       BUILD_BRANCH = ""
        DEPLOY_ENV   = ""
        TARGET_IP_ID = ""
        CC = """${sh(
                returnStdout: true,
                script: 'echo "\$GIT_BRANCH" | cut -d "/" -f 2'
            )}""" 
    }

    stages {
      stage('Setup Environment') {
        steps{
            script{
 if(env.CC == 'main'){
                env.DEPLOY_ENV = 'DEV'
            } else {
                env.DEPLOY_ENV = 'QA'
            }
            }
           
            echo "${env.DEPLOY_ENV}"
        }
      
        }

    }
/*         stage('Checkout') {
            steps {
                echo "Build Branch: ${env.BUILD_BRANCH}"
                checkout scm
            }
        }
        
     stage('Docker Build & Package') {
            steps {
                echo "=== Building Image (NPM Install & Vite Build happen here) ==="
                // Pass your API keys as Build Args so the Dockerfile can use thems
                withCredentials([
                    string(credentialsId: 'VITE_GOOGLE_MAPS_API_KEY', variable: 'MAPS_KEY'),
                    string(credentialsId: 'VITE_STRIPE_PUBLISHABLE_KEY', variable: 'STRIPE_KEY')
                ]) {
                    sh """
                        docker build \
                        --build-arg VITE_GOOGLE_MAPS_API_KEY=${MAPS_KEY} \
                        --build-arg VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_KEY} \
                        -t ${DOCKER_IMAGE} .
                    """
                }
            }
        }
    stage('Remote Deploy') {
        steps {
            script {
      
                def targetServer = (env.BUILD_BRANCH == 'main' || env.BUILD_BRANCH == 'master') ? DEV_SERVER : QA_SERVER
                def envName = (env.BUILD_BRANCH == 'main' || env.BUILD_BRANCH == 'master') ? "PRODUCTION (Dev)" : "QA/STAGING"
                withCredentials([
                    string(credentialsId: 'POSTGRES_USER', variable: 'DB_USER'),
                    string(credentialsId: 'POSTGRES_PASSWORD', variable: 'DB_PASS'),
                    string(credentialsId: 'POSTGRES_DB', variable: 'DB_NAME')
                ]) {
                    // 1. Transfer Image & Compose file
                    sh "docker save ${DOCKER_IMAGE} | ssh -o StrictHostKeyChecking=no ${targetServer} 'docker load'"
                    sh "scp -o StrictHostKeyChecking=no docker-compose.yml ${targetServer}:~/docker-compose.yml"
                    
                    // 2. Deploy with Health Check
                    sh """
                        ssh -o StrictHostKeyChecking=no ${targetServer} "
                            export POSTGRES_USER=${DB_USER}
                            export POSTGRES_PASSWORD=${DB_PASS}
                            export POSTGRES_DB=${DB_NAME}

                            docker compose up -d db
                            
                            echo 'Waiting for PostGIS health...'
                            until [ \\\$(docker inspect -f '{{.State.Health.Status}}' planzo-db) == 'healthy' ]; do 
                                sleep 2
                            done

                            docker compose up -d app
                            docker image prune -f
                        "
                    """
                    env.DEPLOY_TARGET_IP = targetServer.split('@')[1]
                    env.ENV_LABEL = envName
                }
            }
        }
    }
    } */

/*     post {
        success {
            withCredentials([string(credentialsId: 'PLANZO_SLACK_WEBHOOK', variable: 'SLACK_URL'),  
                             string(credentialsId: 'QA_PUBLIC_IP', variable: 'QA_IP'),
                             string(credentialsId: 'DEV_PUBLIC_IP', variable: 'DEV_IP')]) 
            {
                sh """
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"✅ *Build #${env.BUILD_NUMBER} Success* \n*Env:* ${env.ENV_LABEL} \n*URL:* http://${}"}' \
                    ${SLACK_URL}
                """
            }
        }
        failure {
            withCredentials([string(credentialsId: 'PLANZO_SLACK_WEBHOOK', variable: 'SLACK_URL')]) {
                sh """
                    curl -X POST -H 'Content-type: application/json' \
                    --data '{"text":"❌ *Build #${env.BUILD_NUMBER} FAILED* \n*Branch:* ${env.BRANCH_NAME}"}' \
                    ${SLACK_URL}
                """
            }
        }
        always {
            script { 
                cleanWs()
                sh "docker rmi ${DOCKER_IMAGE} || true"
                sh "docker image prune -f"
            }
        }
    } */
}