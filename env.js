var cloud9Evn = {
        'root': __dirname
    ,   'host': 'http://movie-reminder.zelei.c9.io'
    ,   'port': process.env.PORT
    ,   'ip': process.env.IP
}

var rhcloudEvn = {
        'root': __dirname
    ,   'host': 'http://moviereminder-node473140783608.rhcloud.com/'
    ,   'port': process.env.OPENSHIFT_NODEJS_PORT
    ,   'ip': process.env.OPENSHIFT_NODEJS_IP
}


if(process.env.PORT && process.env.IP) {
    module.exports = cloud9Evn;
} else {
    module.exports = rhcloudEvn;    
}