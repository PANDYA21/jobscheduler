### inint #################################################
from pyspark import SparkContext
from pyspark import SparkConf
from pyspark.sql import SparkSession

spark = SparkSession \
    .builder \
    .appName("cronjobstest") \
    .getOrCreate()
###########################################################

# load data from mongo
def getData():
    dat = spark.read \
        .format("com.mongodb.spark.sql.DefaultSource") \
        .option("database", "Stammdaten-test") \
        .option("collection", "NaNbCountsBasket") \
        .load(inferSchema=True)
    return dat

df = getData()
df.show()
