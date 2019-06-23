import json

data = []
with open('client.json') as data_file:    
  data = json.load(data_file)
  # print(data[0]['fields']['date_joined_pyx'])
  date_format = data[0]['fields']['date_joined_pyx'][:data[0]['fields']['date_joined_pyx'].find("T")]
  print(date_format[1:4])
  res = date_format[5:] + "-" + date_format[:4]
  print(res)
  data[0]['fields']['date_joined_pyx'] = '06-01-2019'
# with open('read.json', 'w') as outfile:
#   json.dump(data, outfile, sort_keys=True, indent=4)