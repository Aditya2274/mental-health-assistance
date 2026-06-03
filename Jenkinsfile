// pipeline {
//     agent any
    
//     environment {
//         DOCKER_USER = 'adityaashok2274'
//         IMAGE_NAME = 'mental-health-backend'
//     }
    
//     tools {
//         nodejs 'nodejs24'
//     }
    
//     stages {
//         stage('Checkout repo code') {
//             steps {
//                 git branch: 'main', url: 'https://github.com/Aditya2274/mental-health-assistance'
//             }
//         }
        
//         stage('Installing dependencies') {
//             steps {
//                 dir('backend') {
//                     sh 'npm install'
//                 }
//             }
//         }
        
//         stage('Test phase') {
//             steps {
//                 dir('backend') {
//                     echo 'no written test yet, skipping'
//                 }
//             }
//         }
        
//         stage('Docker-image-build') {
//             steps {
//                 dir('backend') {
//                     // Combine variables in double quotes manually to avoid 'null' error
//                     sh "docker build -t ${env.DOCKER_USER}/${env.IMAGE_NAME}:${env.BUILD_NUMBER} ."
//                 }
//             }
//         }
        
//         stage('Deploying to docker-hub') {
//             steps {
//                 // FIX 1: camelCase passwordVariable & usernameVariable
//                 // FIX 2: Changed usernameVariable to CREDS_USER so it doesn't conflict
//                 withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_PASS', usernameVariable: 'CREDS_USER')]) {
                    
//                     // Use CREDS_USER here, and use backslash $ for bash variables
//                     sh "echo \$DOCKER_PASS | docker login -u \$CREDS_USER --password-stdin"
                    
//                     // Push the manually combined tag
//                     sh "docker push ${env.DOCKER_USER}/${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
                    
//                 } 
//             }
//         }
//     }
// }
// now from here is the pipeline script for using docker to package jenkins environment build itself
pipeline{
    agent any
    environment{
        DOCKER_USER='adityaashok2274'
        IMAGE_NAME='mental-health-backend'
    }
    stages{
        stage('Checkout repository code'){
            steps{
                git branch: 'main', url: 'https://github.com/Aditya2274/mental-health-assistance'
            }
        }
        stage('Install and test (Inside container)'){
            agent{
                docker{
                    image 'node:24'
                    reuseNode true
                }
            }
            steps{
                dir('backend'){
                    sh "npm install"
                    echo "No test , written specifically"
                }
            }
        }
        stage('Build docker image'){
            steps{
                dir('backend'){
                     sh "docker build -t ${env.DOCKER_USER}/${env.IMAGE_NAME}:${env.BUILD_NUMBER} ."
                }
            }
        }
        stage('Deploying docker-image'){
            steps{
                withCredentials(usernamePassword[credentialsId:'dockerhub-creds',passwordVariable:'DOCKER_PASS',usernameVariable:'CREDS_USER']){
                    sh "echo /$DOCKER_PASS | docker login -u $CREDS_USER --password-stdin"
                    sh "docker push ${env.DOCKER_USER}/${env.IMAGE_NAME}:${env.BUILD_NUMBER}"
                }
            }
        }
    }
}