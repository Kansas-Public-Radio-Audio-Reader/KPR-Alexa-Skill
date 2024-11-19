#!/bin/bash

cd /Users/danny/Desktop/work/kprAlexaSkill_code_repository
rm kprAlexaSkillFunction.zip
zip -r kprAlexaSkillFunction.zip .
echo "zipping package complete"
echo "now sending to AWS..."
aws lambda update-function-code --function-name kprAlexaSkillFunction --zip-file fileb://kprAlexaSkillFunction.zip
echo "finished."
echo "DON'T FORGET TO CREATE A NEW LAMBDA VERSION AND UPDATE THE LIVE ALIAS TO THE NEW VERSION"
