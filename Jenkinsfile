pipeline{
    agent any
    environment{
        DOCKER_USER='adityaashok2274'
        IMGAE_NAME='mental-health-backend'
        IMGAE_TAG='${DOCKER_uSER}/${IMAGE_NAME}:${env.BUILDER_NAME}'
    }
    tools{
        nodejs 'nodejs24'
    }
    stages{
        stage('Checkout repo code'){
            steps{
                git branch: 'main',url:'https://github.com/Aditya2274/mental-health-assistance'
            }
        }
        stage('Installing dependencies'){
            steps{
                dir('backend'){
                    sh 'npm install'
                }
            }
        }
        stage('Test phase'){
            steps{
                dir('backend'){
                    echo 'no written test yet, skipping'
                }
            }
        }
        stage('Docker-image-build'){
            steps{
                dir('backend'){
                    sh 'docker build -t ${IMAGE_TAG} .'
                }
            }
        }
        stage('Deploying to docker-hub'){
            steps{
                withCredentials([usernamePassword(credentialsId:'dockerhub-creds',passwordvariable:'DOCKER_PASS',usernamevariable:'DOCKER_USER')])
                sh 'echo /${DOCKER_PASS} |docker login -u ${DOCKER_USER} --password-stdin'
                sh 'docker push ${IMAGE_TAG}'
            }
        }
    }
}