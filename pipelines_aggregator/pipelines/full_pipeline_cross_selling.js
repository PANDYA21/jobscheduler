module.exports = [{
    $match: {
      "plz": {
        "$exists": true
      }
    }
  },
  {
    $match: {
      "orderEntryDate": {
        "$gte": new Date(Date.now() - 2 * 365 * 24 * 3600 * 1000)
      }
    }
  },
  {
    $redact: {
      $cond: [{
        "$eq": [{
          "$strLenCP": "$plz"
        }, 5]
      }, "$$KEEP", "$$PRUNE"]
    }
  },
  {
    $project: {
      produktIdLastTwoChars: {
        $substrCP: ["$produktId", 7, 2]
      },
      produktId: "$produktId",
      customerId: "$customerId",
      gesellschafterId: "$gesellschafterId",
      _id: "$_id"
    }
  },
  {
    $project: {
      produktIdOriginal: "$produktId",
      customerId: "$customerId",
      gesellschafterId: "$gesellschafterId",
      _id: "$_id",
      produktId: {
        $cond: {
          if: {
            "$eq": [{
              "$strLenCP": "$produktIdLastTwoChars"
            }, 2]
          },
          then: {
            "$substr": ["$produktId", 0, 7]
          },
          else: "$produktId"
        }
      }
    }
  },
  {
    $group: {
      _id: {
        customerId: "$customerId",
        gesellschafterId: "$gesellschafterId"
      },
      produkts: {
        $push: {
          $concat: ["$produktId"]
        }
      }
    }
  },
  {
    $unwind: {
      path: "$produkts"
    }
  },
  {
    $group: {
      _id: {
        $concat: ["$produkts", "-", "$_id.customerId", "-", "$_id.gesellschafterId"]
      },
      count: {
        $sum: 1
      }
    }
  },
  {
    $group: {
      _id: "$_id",
      count: {
        $sum: 1
      }
    }
  },
  {
    $group: {
      _id: {
        $substr: ["$_id", 0, 7]
      },
      count: {
        $sum: 1
      }
    }
  },
  {
    $project: {
      produktIdPlz: {
        $split: ["$_id", '-']
      },
      count: "$count"
    }
  },
  {
    $addFields: {
      produktId: {
        $arrayElemAt: ["$produktIdPlz", 0]
      },
      plz: {
        $arrayElemAt: ["$produktIdPlz", 1]
      }
    }
  },
  {
    $out: "Pipeline1Test"
  }];
