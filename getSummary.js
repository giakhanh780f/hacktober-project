let str = "Hello, I am having issues connecting to the cellular service here. Okay, let me check the service in your area real quick. Just give me a moment okay? " +
    "Okay" + "Alright, it looks like the cell towers over there are overloaded. We have technicians working on the solution, a fix to the problem is being implemented currently, cellular service should be back to normal in about a few hours." +
    "A few hours? Okay. Thank you for the information. No problem, you have a good day. I also had trouble 4glte connection.";

console.log(getSummary(str));
function getSummary(str){
    //console.log(str);
    
        let summary = "Issues: \n";
        //user problem
        let keyWords = ['trouble', 'issue', 'problem'];
        let keyWordStartPos = -1;  
        let j = 0;  
        for (let i = 0; i < keyWords.length; i++) {//loops through each possible keyword
            keyWordStartPos = -1;//sets the start pos to the beg each iteration
            //console.log("Searching for keyword " + keyWords[i]);
            for(let j = 0; j < str.length; j++) {//length of the string of the conversation
                // Pick up keyword, get the next sentence or so, etc, save it to some 
                //  letiable or write it to the summary
                let foundWordPos = str.indexOf(keyWords[i], keyWordStartPos+1); 
                //console.log(str.indexOf('.'));
                if(foundWordPos > -1)
                {
                    let periodPos = findPeriod(str, foundWordPos);
                    let summaryPart = "";
                    if(periodPos != -1) {
                        summaryPart = str.substr(foundWordPos, periodPos-foundWordPos) + "\n";
                    } else {
                        summaryPart = str.substr(foundWordPos, str.length-foundWordPos) + "\n";
                    }
                    summary += summaryPart; 
                    //console.log("Current keyword: " + keyWords[i] + ", found at position " + foundWordPos);
                    //console.log("Summary added: " + summaryPart);
    
                    j = foundWordPos;
                    keyWordStartPos = foundWordPos; 
                }
                
            }
    
        }
        summary += "\nSolutions: \n";
        let solutionW = ['solution', 'answer', 'fix'];
        keyWordStartPos = -1;  
        j = 0;  
        for (let i = 0; i < solutionW.length; i++) {//loops through each possible keyword
            keyWordStartPos = -1;//sets the start pos to the beg each iteration
            //console.log("Searching for keyword " + solutionW[i]);
            for(let j = 0; j < str.length; j++) {//length of the string of the conversation
                // Pick up keyword, get the next sentence or so, etc, save it to some 
                //  letiable or write it to the summary
                let foundWordPos = str.indexOf(solutionW[i], keyWordStartPos+1); 
                //console.log(str.indexOf('.'));
                if(foundWordPos > -1)
                {
                    let periodPos = findPeriod(str, foundWordPos);
                    let summaryPart = "";
                    if(periodPos != -1) {
                        summaryPart = str.substr(foundWordPos, periodPos-foundWordPos) + "\n";
                    } else {
                        summaryPart = str.substr(foundWordPos, str.length-foundWordPos) + "\n";
                    }
                    summary += summaryPart; 
                    //console.log("Current keyword: " + solutionW[i] + ", found at position " + foundWordPos);
                    //console.log("Summary added: " + summaryPart);
    
                    j = foundWordPos;
                    keyWordStartPos = foundWordPos; 
                }
                
            }
    
        }

        //console.log("Finished parsing");
        
        //solution
        //console.log(summary);
        return summary;
    }
    function findPeriod(str, startIndex) {
        for(let i = startIndex; i < str.length; i++) {
            if(str.charAt(i) == '.') return i;
        }
        return -1;
    }