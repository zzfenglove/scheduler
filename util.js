Array.prototype.contains = function (obj) {  
    var i = this.length;  
    while (i--) {  
        if (this[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 

Array.prototype.sumUnic = function(name, sumName){
    var returnArr = [];
    var obj = this;
    for(var x = 0; x<obj.length; x++){
        if((function(source){
            if(returnArr.length == 0){
                return true;
            }else{
                for(var y = 0; y<returnArr.length; y++){
                    var isThere = [];
                    if(returnArr[y][name] == source[name]){
                        returnArr[y][sumName] = parseFloat(returnArr[y][sumName]) + parseFloat(source[sumName]);
                        return false;
                    }else{
                        isThere.push(source);
                    }
                }
                if(isThere.length>0)returnArr.push(source);
                return false;
            }
        })(obj[x])){
            returnArr.push(obj[x]);
        }
    }
    return returnArr;
}

Array.prototype.unique=function(obj,property){
    var i=this.length;
    while(i--){
        console.log(this[i][property]);
        console.log(obj[property]);

        if(this[i].ActiveType==obj.ActiveType&&this[i].Id==obj.Id&&this[i].hasOwnProperty(property)==obj.hasOwnProperty(property)){
            return true;
        }
    }
    return false;
}

Array.prototype.find=function(id){
    var i=this.length;
    while(i--){
        if(this[i].Id==id){
            retu