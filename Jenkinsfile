pipeline {
    agent any
    
    parameters {
        booleanParam(
            name: 'SKIP_HEALTH_CHECK',
            defaultValue: true,
            description: 'Skip the Docker container health check (useful for faster builds)'
        )
        booleanParam(
            name: 'DEPLOY',
            defaultValue: false,
            description: 'Deploy the container after successful build'
        )
    }
    
    environment {
        // Docker image configuration
        DOCKER_IMAGE = 'othello-dojo'
        DOCKER_TAG = 'latest'
        
        // Container configuration
        CONTAINER_NAME = 'othello-dojo-container'
        APP_PORT = '3000'
        
        // Registry configuration (optional - for pushing to Docker Hub)
        DOCKER_REGISTRY = 'your-registry'
        DOCKER_IMAGE_FULL = "${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm run lint'
                sh 'npm run typecheck'
                sh 'npm test'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    // Build the Docker image
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo '🧪 Testing Docker image...'
                script {
                    // Run a quick test to ensure the container starts
                    // Use .env if it exists, otherwise run without it (for Render secrets)
                    sh '''
                        if [ -f .env ]; then
                            docker run --rm -d --name test-container -p 3001:3000 --env-file .env ${DOCKER_IMAGE}:${DOCKER_TAG}
                        else
                            echo "No .env file found, running container without it (using default env vars)"
                            docker run --rm -d --name test-container -p 3001:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        fi
                    '''
                    
                    // Wait for container to start
                    sh 'sleep 15'
                    
                    // Conditional health check based on parameter
                    if (params.SKIP_HEALTH_CHECK) {
                        echo '⏭️ Skipping health check as requested'
                        sh 'docker ps | grep test-container'
                    } else {
                        echo '🔍 Running health check...'
                        sh 'curl -f http://localhost:3001/api/health || echo "Container health check failed"'
                    }
                    
                    // Clean up test container
                    sh 'docker stop test-container || true'
                    sh 'docker rm test-container || true'
                }
            }
        }
        
        stage('Push to Registry (Optional)') {
            when {
                // Only run if credentials are configured
                expression { 
                    return env.DOCKER_REGISTRY != 'your-registry' && 
                           env.DOCKER_USERNAME && 
                           env.DOCKER_PASSWORD 
                }
            }
            steps {
                echo '📤 Pushing image to registry...'
                script {
                    // Tag image for registry
                    sh 'docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE_FULL}'
                    
                    // Login to registry
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    
                    // Push image
                    sh 'docker push ${DOCKER_IMAGE_FULL}'
                    
                    // Clean up
                    sh 'docker logout'
                }
            }
        }
        
        stage('Deploy (Optional)') {
            when {
                // Only run if deployment is requested
                expression { return params.DEPLOY }
            }
            steps {
                echo '🚀 Deploying application...'
                script {
                    // Stop existing container if running
                    sh 'docker stop ${CONTAINER_NAME} || true'
                    sh 'docker rm ${CONTAINER_NAME} || true'
                    
                    // Run new container
                    sh '''
                        if [ -f .env ]; then
                            docker run -d \
                                --name ${CONTAINER_NAME} \
                                -p ${APP_PORT}:3000 \
                                --env-file .env \
                                --restart unless-stopped \
                                ${DOCKER_IMAGE}:${DOCKER_TAG}
                        else
                            echo "No .env file found, deploying with default environment variables"
                            docker run -d \
                                --name ${CONTAINER_NAME} \
                                -p ${APP_PORT}:3000 \
                                --restart unless-stopped \
                                ${DOCKER_IMAGE}:${DOCKER_TAG}
                        fi
                    '''
                    
                    // Wait for container to start
                    sh 'sleep 15'
                    
                    // Verify deployment
                    sh 'docker ps | grep ${CONTAINER_NAME}'
                    sh 'curl -f http://localhost:${APP_PORT} || echo "Deployment verification failed"'
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            // Clean up any test containers
            sh 'docker stop test-container || true'
            sh 'docker rm test-container || true'
            
            // Clean up Docker images to save space
            sh 'docker image prune -f || true'
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            
        }
        
        failure {
            echo '❌ Pipeline failed!'
           
        }
    }
}
