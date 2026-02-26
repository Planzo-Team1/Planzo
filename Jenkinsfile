pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        APP_NAME     = 'planzo-web'
        DEV_SERVER   = "ubuntu@172.31.6.31"
        
        // IMPORTANT: These IDs must exist EXACTLY as written in Jenkins Credentials UI
        MAPS_KEY     = credentials('VITE_GOOGLE_MAPS_API_KEY')
        STRIPE_KEY   = credentials('VITE_STRIPE_PUBLISHABLE_KEY')
        
        // If 'github-token' is a Username with Password type:
        GIT_CREDS    = credentials('github-token')
    }

    stages {
        stage('Checkout') {
            steps {
                // Using the GIT_CREDS to authenticate the checkout
                checkout([$class: 'GitSCM', 
                    branches: [[name: '*/test_jenkins']], 
                    userRemoteConfigs: [[
                        url: 'https://github.com/kevinr78/Planzo.git',
                        credentialsId: 'github-token' 
                    ]]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Installing npm dependencies ==='
                sh 'npm ci --prefer-offline'
            }
        }

        stage('Build Frontend') {
            steps {
                // Using the variables defined in the environment block
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
                    sh "scp -o StrictHostKeyChecking=no docker-compose.yml ${DEV_SERVER}:~/docker-compose.yml"
                    
                    sh """
                        ssh -o StrictHostKeyChecking=no ${DEV_SERVER} "
                            export POSTGRES_USER=${env.POSTGRES_USER}
                            export POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD}
                            docker-compose up -d db
                            
                            echo 'Waiting for PostGIS...'
                            until [ \\\$(docker inspect -f '{{.State.Health.Status}}' planzo-db) == 'healthy' ]; do 
                                sleep 2
                            done
                            
                            docker-compose up -d app
                        "
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Complete"
        }
        always {
            // Secure cleanup: only runs if a workspace actually exists
            script {
                if (env.NODE_NAME) {
                    cleanWs()
                }
            }
        }
    }
}