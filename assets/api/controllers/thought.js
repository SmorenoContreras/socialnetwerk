const thoughtModel = require("../models/thought");
const { ObjectId } = require("mongodb")

exports.create = async (req, res) => {
    try {

        const body = req.body;

        const userId = req.user.userId;

        body.userId = userId;

        const thought = await thoughtModel.create(body);

        res.send({ data: thought });
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
        let reactionFilter = { };

        if (queryFilter.reaction) {
            reactionFilter["reactionType"] = queryFilter.reaction;
        };

        if (queryFilter.userId) {
            filter["userId"] = new ObjectId(queryFilter.userId);
        };

        if (queryFilter.description) {
            filter["description"] = { $regex: queryFilter.description, $options: "i" };
        }

        if (queryFilter._id) {
            filter["_id"] = new ObjectId(queryFilter._id);
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
                'from': 'likes', 
                'localField': '_id', 
                'foreignField': 'thoughtId', 
                'pipeline': [
                  {
                    '$project': {
                      'thoughtId': 1, 
                      'likedBy': 1, 
                      'reactionType': 1
                    }
                  },
                  {
                    $match: {
                        ...reactionFilter
                    }
                  },
                 {
                    '$lookup': {
                      'from': 'users', 
                      'localField': 'likedBy', 
                      'foreignField': '_id', 
                      'pipeline': [
                        {
                          '$project': {
                            'fullName': 1
                          }
                        }
                      ], 
                      'as': 'likedUser'
                    }
                  }, {
                    '$unwind': {
                      'path': '$likedUser', 
                      'preserveNullAndEmptyArrays': true
                    }
                  }
                ], 
                'as': 'thoughs'
              }
            }
          ]

          console.log("query is ", JSON.stringify(query));

        const thought = await thoughtModel.aggregate(query);
        res.send({ data: thought });

  } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err});
    }

};

exports.findOneAndUpdate = async (req, res) => {
    try {
        let set = req.body;
        let filter = { _id: new ObjectId(req.params.id) };

        let thought = await thoughtModel.findOneAndUpdate(filter, { $set: set }, { new: true })
        res.send({ data: thought});
    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err});
    }
};


exports.findOneAndDelete = async (req, res) => {
    try {
        let filter = { _id: new ObjectId(req.params.id) };

        let thought = await thoughtModel.findOneAndUpdate(filter, { $set: { active: false } }, { new: true });
        
        res.send({ data: thought});
    } catch (err) {
        console.log("error is ", err);
        res.status(400).send({ error: err});
    }
};

