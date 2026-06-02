pipeline{
    agent any
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
        stage('Deployment phase'){
            steps{
                echo 'Backend is deployed'
            }
        }
    }
}