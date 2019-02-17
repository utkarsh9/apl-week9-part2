var fs=require('fs');
var final=new Map();

function *partition (dataStr,nlines){
    var lines=dataStr.split("\n");
    for(var i=0;i<lines.length;i+=nlines){
        var j=i+nlines;
        yield lines.slice(i,j)
    }
}

function splitWords(dataStr){
    var temp=[];
    var stopWords=fs.readFileSync("stop-words.txt", 'utf8').split(",").map(str=>{
        return str.toLowerCase();
    });
    function scan(strData){
        var data=strData.replace(/[\W_]+/g, ' ').toLowerCase().split(' ');
        return data;
    }
    function removeStopWords(wordList){
        for(i=0;i<wordList.length;i++){
            if(!stopWords.includes(wordList[i]) && "s".localeCompare(wordList[i]) && "".localeCompare(wordList[i])){
                temp.push(wordList[i]);
            }
        }
        return temp;
    }
    var result=[];
    var words=removeStopWords(scan(dataStr));
    for(var i=0;i<words.length;i++){
        result.push([words[i],1]);
    }
    return result;
}

function regroup(pairsList){
    var a_e=[];
    var f_j=[];
    var k_o=[];
    var p_t=[];
    var u_z=[];
    var mapping=new Map();

    for(var i=0;i<pairsList.length;i++){
        for(var j=0;j<pairsList[i].length;j++){
            let word=pairsList[i][j][0];
            if(word[0]=='a'||word[0]=='b'||word[0]=='c'||word[0]=='d'||word[0]=='e'){
                a_e.push([word,1]);
            }else if(word[0]=='f'||word[0]=='g'||word[0]=='h'||word[0]=='i'||word[0]=='j'){
                f_j.push([word,1]);
            }else if(word[0]=='k'||word[0]=='l'||word[0]=='m'||word[0]=='n'||word[0]=='o'){
                k_o.push([word,1]);
            }else if(word[0]=='p'||word[0]=='q'||word[0]=='r'||word[0]=='s'||word[0]=='t'){
                p_t.push([word,1]);
            }else if(word[0]=='u'||word[0]=='v'||word[0]=='w'||word[0]=='x'||word[0]=='y'||word[0]=='z'){
                u_z.push([word,1]);
            }
        }
    }
    
    mapping.set("a-e",a_e);
    mapping.set("f-j",f_j);
    mapping.set("k-o",k_o);
    mapping.set("p-t",p_t);
    mapping.set("u-z",u_z);

    return mapping
}

function countWords(arrayElem){
    var count=1;
    if(final.has(arrayElem[0])){
        count=final.get(arrayElem[0]);
        count=count+1;
    }
    final.set(arrayElem[0],count);
    
}

function readFile(filePath){
    var data=fs.readFileSync(filePath, 'utf8');
    return data;
}

for( var v of partition(readFile(process.argv[2]),200)){
    var data=v.map(splitWords);
    var mapping=regroup(data);
    for(const v of mapping.values()){
        v.map(countWords);
    }
}

var sortedMap=new Map([...final.entries()].sort((a,b)=>b[1]-a[1]));
var mapIter=sortedMap.entries();
var counter=0;
while(counter<25){
    console.log(mapIter.next().value)
    counter++;
}