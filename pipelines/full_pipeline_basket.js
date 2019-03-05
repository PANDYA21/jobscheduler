module.exports = [{
  $match: {
    "plz": {
      "$exists": true
    }
  }
}, {
  $match: {
    "orderEntryDate": {
      "$gte": new Date(Date.now() - 2 * 365 * 24 * 3600 * 1000)
    }
  }
}, {
  $redact: {
    $cond: [{
        "$eq": [{
          "$strLenCP": "$plz"
        }, 5]
      },
      "$$KEEP",
      "$$PRUNE"
    ]
  }
}, {
  $project: {
    produktIdLastTwoChars: {
      $substrCP: ["$produktId", 7, 2]
    },
    produktId: "$produktId",
    plz: "$plz",
    orderId: "$orderId",
    gesellschafterId: "$gesellschafterId",
    _id: "$_id"
  }
}, {
  $project: {
    produktIdOriginal: "$produktId",
    plz: "$plz",
    orderId: "$orderId",
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
}, {
  $group: {
    _id: {
      orderId: "$orderId",
      plz: "$plz",
      gesellschafterId: "$gesellschafterId"
    },
    produkts: {
      $push: {
        $concat: ["$produktId"]
      }
    }
  }
}, {
  $unwind: {
    path: "$produkts"
  }
}, {
  $group: {
    _id: {
      $concat: ["$produkts", "-", "$_id.plz", "-", "$_id.orderId", "$_id.gesellschafterId"]
    },
    count: {
      $sum: 1
    }
  }
}, {
  $group: {
    _id: "$_id",
    count: {
      $sum: 1
    }
  }
}, {
  $group: {
    _id: {
      $substr: ["$_id", 0, 10]
    },
    count: {
      $sum: 1
    }
  }
}, {
  $project: {
    produktIdPlz: {
      $split: ["$_id", '-']
    },
    count: "$count"
  }
}, {
  $addFields: {
    produktId: {
      $arrayElemAt: ["$produktIdPlz", 0]
    },
    plz: {
      $arrayElemAt: ["$produktIdPlz", 1]
    }
  }
}, {
  $out: "pipelineTest1"
}];