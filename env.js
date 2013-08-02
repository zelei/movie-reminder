var loadModule = function(moduleName) {
    return require(__dirname + moduleName); 
};

var cloud9Evn = {
        'root': __dirname
    ,   'host': 'http://movie-reminder.zelei.c9.io'
    ,   'port': process.env.PORT
    ,   'ip': process.env.IP
    ,   'require' : loadModule
    ,   'google' :  {
            'clientID' : "678201232526.apps.googleusercontent.com"
        ,   'clientSecret' : "B6Cgp--Ne_MXhxOC8ak_-0au"    
    }
    ,   'mongo' : {
            'user' : undefined
        ,   'password' : undefined
        ,   'name' : 'data'
        ,   'url' : process.env.IP
    }
};

var rhcloudEvn = {
        'root': __dirname
    ,   'host': 'http://moviereminder-node473140783608.rhcloud.com'
    ,   'port': process.env.OPENSHIFT_NODEJS_PORT
    ,   'ip': process.env.OPENSHIFT_NODEJS_IP
    ,   'require' : loadModule
    ,   'google' :  {
            'clientID' : "212275809096.apps.googleusercontent.com"
        ,   'clientSecret' : "aPv0xBH3Acre6WTbU4lmbQ4c"    
    }
    ,   'mongo' : {
            'user' : 'admin'
        ,   'password' : 'NpNr6_zw45vs'
        ,   'name' : 'moviereminder'
        ,   'url' : process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT
    }
};

if(process.env.PORT && process.env.IP) {
    module.exports = cloud9Evn;
} else {
    module.exports = rhcloudEvn;    
}