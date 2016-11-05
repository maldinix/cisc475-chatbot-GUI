function getFCAS(myCommand){

  var myUrl = "http://fcas-test.us-east-1.elasticbeanstalk.com";
  var myKey = "/devel";

  var myFullUrl = myUrl + myKey + myCommand;

  httpGetAsync(myFullUrl, processJSONText);

}


function bcl_go( e )
{
  var cmd = e.bclline.value;
  bcl_run( cmd );
  e.bclline.focus();
  return false;
}

function bcl_parse( cmd )
{
  return cmd.split( /\s+/ );
}

function bcl_remove_blank_words( words )
{
  // Remove leading and trailing blank words.
  while (words.length>0 && words[0]==="") {
    words = words.slice( 1 );
  }
  while (words.length>0 && words[words.length-1]==="") {
    words = words.slice( 0, words.length-1 );
  }
  return words;
}

function bcl_run( cmd )
{
  words = bcl_parse( cmd );
  words = bcl_remove_blank_words( words );

  var last_cmd_word = null;
  var fun_name = "";

  for (var i=0; i<words.length; ++i) {
     fun_name += words[i] + "_";
  }
  fun_name =  fun_name.slice(0,fun_name.length-1);

  eval(fun_name+"()");


}

function list_model(){

  getFCAS("/model/list");

}

function describe_model(){

  getFCAS("/model/describe/mlp-stats-0");

}

function list_all_threats(){

  getFCAS("/threat/list/0/10");

}

function describe_goodware(){

  getFCAS("/target/describe/Goodware");

}

function describe_ramnit(){

  getFCAS("/target/describe/Ramnit");

}

function describe_malware(){

  getFCAS("target/describe/Malware");

}
