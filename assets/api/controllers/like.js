const likeModel = require("../models/like");
const { ObjectId } = require("mongodb")

exports.create = async (req, res) => {
    try {

        const body = req.body;

        const userId = req.user.userId;

        body.likedBy = userId;

        const like = await likeModel.create(body);

        res.send({ data: like });

    } catch (error) {
        console.log("error is ", error);
        res.status(400).send({ error: error});
    }
};

exports.find = async (req, res) => {
    try {

        let queryFilter = req.query ? req.query : {};

        const pagination = { skip: 0, limit: 30 };

        if (queryFilter.pageNo && queryFilter.pageSize) {
            pagination.skip = parseInt((queryFilter.pageNo - 1) * queryFilter.pageSize);
            pagination.limit = parseInt(queryFilter.pageSize);
        };

        let filter = { active: true };

        if (queryFilter.likedBy) {
            filter["likedBy"] = new ObjectId(queryFilter.likedBy);
        };

        if (queryFilter.thoughtId) {
            filter["thoughtId"] = new ObjectId(queryFilter.thoughtId);
        }

        if (queryFilter._id) {
            filter["_id"] = new ObjectId(queryFilter._id);
        }

        const like = await likeModel.find(filter, {}).skip(pagination.skip).limit(pagination.limit);
        res.send({ data: like });

  } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err});
    }

};

exports.findOneAndUpdate = async (req, res) => {
    try {
        let set = req.body;
        let filter = { _id: new ObjectId(req.params.id) };

        let like = await likeModel.findOneAndUpdate(filter, { $set: set }, { new: true })
        res.send({ data: like});
    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err});
    }
};


exports.findOneAndDelete = async (req, res) => {
    try {
        let filter = { _id: new ObjectId(req.params.id) };

        let like = await likeModel.findOneAndUpdate(filter, { $set: { active: false } }, { new: true });
        
        res.send({ data: like});
    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err});
    }
};

