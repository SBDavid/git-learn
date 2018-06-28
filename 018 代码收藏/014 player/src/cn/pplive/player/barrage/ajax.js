/**
 * Created by chunbolv on 2017/7/25.
 */
/*
* ajax({
* type:"POST",
* url:"ajax.php",
* dataType:"json",
* data:{"val1":"abc","val2":123,"val3":"456"},
* beforeSend:function(){
* //some js code
* },
* success:function(msg){
* console.log(msg)
* },
* error:function(){
* console.log("error")
* }
 })
* */
export class Ajax {
    constructor() {
        this.type = "GET";
        this.url = "";
        this.async = "true";
        this.data = null;
        this.dataType = "text";
        this.contentType = "application/x-www-form-urlencoded";
        this.beforeSend = function(){};
        this.success = function(){};
        this.error = function(){};
    }
    ajax(opt) {
        let self = this;
        self.type = opt.type || "GET";
        self.url = opt.url || "";
        self.async = opt.async || "true";
        self.data = opt.data || null;
        self.dataType = opt.dataType || "text";
        self.contentType = opt.contentType || "application/x-www-form-urlencoded";
        self.beforeSend = opt.beforeSend || function(){};
        self.success = opt.success || function(){};
        self.error = opt.error || function(){};
        self.beforeSend();
        var xhr = self.createxmlHttpRequest();
        xhr.responseType=self.dataType;
        xhr.open(self.type,self.url,self.async);
        xhr.setRequestHeader("Content-Type",self.contentType);
        xhr.send(self.convertData(self.data));
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    self.success(xhr.response)
                }else{
                    self.error();
                }
            }
        }
    }
    createxmlHttpRequest() {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }
    convertData(data){
        if( typeof data === 'object' ){
            var convertResult = "" ;
            for(var c in data){
                convertResult+= c + "=" + data[c] + "&";
            }
            convertResult=convertResult.substring(0,convertResult.length-1)
            return convertResult;
        }else{
            return data;
        }
    }
}