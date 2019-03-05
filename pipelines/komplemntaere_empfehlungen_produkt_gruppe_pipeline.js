module.exports =  [{
    $project: {
      mitegronummer7LastTwoChars: {
        $substrCP: ["$mitegronummer7", 7, 2]
      },
      mitegronummer7: "$mitegronummer7",
      "herstellername": "$herstellername",
      "marke": "$marke",
      "produktserie": "$produktserie",
      "zolltarifnummer": "$zolltarifnummer"
    }
  }, {
    $project: {
      mitegronummer7Original: "$mitegronummer7",
      "herstellername": "$herstellername",
      "marke": "$marke",
      "produktserie": "$produktserie",
      "zolltarifnummer": "$zolltarifnummer",
      mitegronummer7: {
        $cond: {
          if: {
            "$eq": [{
              "$strLenCP": "$mitegronummer7LastTwoChars"
            }, 2]
          },
          then: {
            "$substr": ["$mitegronummer7", 0, 7]
          },
          else: "$mitegronummer7"
        }
      }
    }
  }, {
    $group: {
      _id: {
        "herstellername": "$herstellername",
        "marke": "$marke",
        "produktserie": "$produktserie",
        "zolltarifnummer": "$zolltarifnummer"
      },
      produkts: {
        $push: "$mitegronummer7"
      }
    }
  }, {
    $out: "Pipeline2Test"
  }];
