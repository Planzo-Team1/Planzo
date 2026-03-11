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
        SLACK_URL    = credentials("PLANZO_SLACK_WEBHOOK")
        GIT_BRANCH = """${sh(
                returnStdout: true,
                script: 'echo "\$GIT_BRANCH" | cut -d "/" -f 2'
            )}""" 
        MAPS_KEY: credentials('VITE_GOOGLE_MAPS_API_KEY')
        STRIPE_KEY: credentials('VITE_STRIPE_PUBLISHABLE_KEY')
        DB_USER: credentials('POSTGRES_USER')
        DB_PASS: credentials('POSTGRES_PASSWORD')
        DB_NAME: credentials('POSTGRES_DB')
    }

    stages {
    stage('Setup Environment') {
        steps{
            script{
             if(env.GIT_BRANCH == 'main'){
                env.DEPLOY_ENV = 'DEV'
                env.TARGET_IP_ID = credentials('DEV_PUBLIC_IP');
                env.TARGET_SERVER =  "${DEV_SERVER}"
            } else {
                env.DEPLOY_ENV = 'QA'
                env.TARGET_IP_ID = credentials('QA_PUBLIC_IP');
                env.TARGET_SERVER =  "${QA_SERVER}"
            }
            }
           
        }
    }      
    stage('Checkout') {
        steps {
            checkout scm
        }
    }
    stage('Docker Build & Package') {
        steps {
            echo "=== Building Image ==="
            {
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
            {
                // 1. Transfer Image & Compose file
                sh "docker save ${DOCKER_IMAGE} | ssh -o StrictHostKeyChecking=no ${env.TARGET_SERVER} 'docker load'"
                sh "scp -o StrictHostKeyChecking=no docker-compose.yml ${env.TARGET_SERVER}:~/docker-compose.yml"
                
                // 2. Deploy with Health Check
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
}
post {
    success {
        sh """
            curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"✅ *Build #${env.BUILD_NUMBER} Success* \n*Env:* ${env.DEPLOY_ENV} \n*URL:* http://${env.TARGET_IP_ID}"}' \
            ${env.SLACK_URL}
        """
    }
    failure {
    
        sh """
            curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"❌ *Build #${env.BUILD_NUMBER} FAILED* \n*Branch:* ${env.BRANCH_NAME}"}' \
            ${env.SLACK_URL}
        """
    }
    always {
        script { 
            cleanWs()
            sh "docker rmi ${DOCKER_IMAGE} || true"
            sh "docker image prune -f"
        }
    }
}
}
