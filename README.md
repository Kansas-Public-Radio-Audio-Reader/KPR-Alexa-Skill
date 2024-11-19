README

kpr Alexa skill code reposity

this is the code that is used to develope the KPR skill for alexa

To update the code that is stored in Amazon Lambda with this code, then you can
use the updateLambdaCode.sh
 - you may need to change the directory variable in the bash script
 - you must have the AWS CLI tools installed on your machine
 - You'll need to have the AWS Lambda CLI tool initialized: `$ aws configure`

AFTER UPDATING, YOU MUST FOLLOW THESE STEPS TO UPDATE THE CODE VERSION IN LAMBDA:
 1. log into AWS Lambda
 2. click on Versions and create a new version of the $LATEST alias
 3. click on Aliases, click on LIVE, click on Edit, and then select the new version you created in step 2


 -Danny
