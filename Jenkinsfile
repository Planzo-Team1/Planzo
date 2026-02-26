pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        APP_NAME     = 'planzo-web'
        DEV_SERVER   = "ubuntu@172.31.6.31" // Update this
        MAPS_KEY     = credentials('VITE_GOOGLE_MAPS_API_KEY')
        STRIPE_KEY   = credentials('VITE_STRIPE_PUBLISHABLE_KEY')
        DB_CREDS_USR   = credentials('POSTGRES_USER')
        DB_CREDS_PSW   = credentials('POSTGRES_PASSWORD')
        GIT_AUTH = credentials('github-token')
    }

    stages {
        stage('Checkout') {
            steps {
              checkout([$class: 'GitSCM', 
              branches: [[name: '*/test_jenkins']], 
              userRemoteConfigs: [[url: 'https://github.com/kevinr78/Planzo.git']]
]) }
        }
            stage('Install Dependencies') {
      steps {
        echo '=== Installing npm dependencies ==='
        sh 'npm ci --prefer-offline'
      }
    }
        stage('Build Frontend') {
            steps {
                // Vite injects these at build time into the JS bundle
                sh "VITE_GOOGLE_MAPS_API_KEY=${MAPS_KEY} VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_KEY} npm run build"
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${APP_NAME}:latest ."
            }
        }

        stage('Remote Deploy') {
            steps {
                script {
                    // 1. Transfer docker-compose to Dev Server
                    sh "scp -o StrictHostKeyChecking=no docker-compose.yml ${DEV_SERVER}:~/docker-compose.yml"
                    
                    // 2. Execute Deployment on Dev Server
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEV_SERVER} "
                            export POSTGRES_USER=${DB_CREDS_USR}
                            export POSTGRES_PASSWORD=${DB_CREDS_PSW}
                            docker-compose up -d db
                            
                            echo 'Waiting for PostGIS...'
                            until [ \\\$(docker inspect -f '{{.State.Health.Status}}' planzo-db) == 'healthy' ]; do sleep 2; done
                            
                            docker-compose up -d app
                        "
                    """
                }
            }
        }
    }

    post {
        success { echo "✅ Deployment Complete" }
        always { cleanWs() }
    }
}