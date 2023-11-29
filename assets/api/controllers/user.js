const userModel = require("../../api/models/user");
const userHelper = require("../helper/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb");

exports.createUser = async (req, res) => {
    try {

        const body = req.body;

        body.password = await bcrypt.hash(body.password, 10);
        
        console.log("body is ", body);
        const user = await userModel.create(body);

        const tokenBody = {
            userId: user._id,
            fullName: user.fullName,
            email: user.email
        };

        const token = await userHelper.getToken(tokenBody);

        const response = {
            ...tokenBody,
            authToken: token,
        }
        return res.send({ data: response});

    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ err: err });
    }
};

exports.login = async (req, res) => {
    try {

        const body = req.body;

        if(!body.email || !body.password) {
            return res.status(400).send({ error: "Please pass required fields!"});
        };

        const user = await userModel.findOne({ email: body.email });

        if (!user) {
            return res.status(400).send({ error: "User not exist!"});
        };

        const result = await bcrypt.compare(body.password, user.password);

        if(!result) {
            return res.status(401).send({ error: "Incorrect password!"});
        };

        const tokenBody = {
            userId: user._id,
            fullName: user.fullName,
            email: user.email
        };

        const token = await userHelper.getToken(tokenBody);

        const response = {
            ...tokenBody,
            authToken: token,
        };

        return res.send({ data: response});

    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err });
    }
};

exports.addRemoveFriend = async (req, res, next) => {
    try {

        const body = req.body;

        if (!body.type) {
            return res.status(400).send({error: "Please pass type!"});
        };

        const userId = req.user.userId;

        let user
        if (body.type === 'add') {
            user = await userModel.findOneAndUpdate({ _id: new ObjectId(userId)}, { $addToSet: { friends: body.friends }});
        };

        if (body.type === 'remove') {
            user = await userModel.findOneAndUpdate({ _id: new ObjectId(userId)}, { $pull: { friends: { $in: body.friends } }});
        };

        res.send({ data: user });
    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err });
    }
};

exports.userList = async (req, res) => {
    try {
        
        let queryFilter = req.query ? req.query : {};

        const pagination = { skip: 0, limit: 30 };

        if (queryFilter.pageNo && queryFilter.pageSize) {
            pagination.skip = parseInt((queryFilter.pageNo - 1) * queryFilter.pageSize);
            pagination.limit = parseInt(queryFilter.pageSize);
        };

        let filter = { };

        if (queryFilter.id) {
            filter["_id"] = new ObjectId(queryFilter.id);
        };

        const query = [
            {
                $match: {
                    ...filter
                }
            },
            {
                $skip: pagination.skip
            },
            {
                $limit: pagination.limit
            },
            {
              '$lookup': {
                'from': 'users', 
                'localField': 'friends', 
                'foreignField': '_id', 
                'pipeline': [
                  {
                    '$project': {
                      'fullName': 1
                    }
                  }
                ], 
                'as': 'friends'
              }
            }
          ];

        const user = await userModel.aggregate(query);
        res.send({ data: user });

    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err });
    }
}