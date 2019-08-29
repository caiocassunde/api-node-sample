const express = require('express');

const User = require('../models/User');

const router = express.Router();

router.get('/register/get-email', async (req, res) => {
    try{
        const {email} = req.query
        var ret = await User.findOne({email});
        if(ret){
            return res.send({ret});
        }else{
            return res.status(400).send({error: 'Client not found in DB'})
        }
    }catch(err){
        return res.status(400).send({error: 'GET Failed'});
    }
});

router.post('/register', async (req, res) => {
    try{
        const {email} = req.body;

        if(await User.findOne({email}))
            return res.status(400).send({ erro: 'User already exists'}) 
        
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({user});     
    }catch (err){
        return res.status(400).send({error: 'Registration failed'});
    }
});

router.delete('/register/delete-email/:email', async (req, res) => {
    try{
        const {email} = req.params
        console.log({email});
        var ret = await User.findOne({email});
        if(ret){
            await User.deleteOne({email});
            return res.send({message: 'Client Deleted'});
        }else{
            return res.status(400).send({error: 'Client not found in DB'})
        }
    }catch(err){
        return res.status(400).send({error: 'DELETE Failed'});
    }
});

router.get('/call-api', async (req, res) => {
    const request = require('request')
    options = {
        uri: `https://pokeapi.co/api/v2`,
        method: 'GET',
        href: '',
        pathname: '/pokemon/1/'
    };
    try{
        request(options, function (err, resp, body){
            if(err != null){
                if(err.errno == 'ENOTFOUND'){
                    throw new Error('Conection Failed');
                }
            }
            return res.send(JSON.parse(body).ability);      
        });
    }catch(Error){
        return res.status(500).send({error: Error});
    }
});

module.exports = app => app.use('/auth', router);