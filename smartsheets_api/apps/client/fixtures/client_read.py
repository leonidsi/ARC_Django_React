import json

data = []
with open('client_csv.json') as data_file:    
  data = json.load(data_file)
  # print(data[0]['fields']['date_joined_pyx'])
  for i in range(len(data)):
    if 'date_joined_pyx' in data[i]['fields']:
      date_format = data[i]['fields']['date_joined_pyx'][:data[i]['fields']['date_joined_pyx'].find("T")]
      res = date_format[5:] + "-" + date_format[:4]
      data[i]['fields']['date_joined_pyx'] = res

    # date_format = data[i]['fields']['date_joined_pyx'][:data[i]['fields']['date_joined_pyx'].find("T")]
    # res = date_format[5:] + "-" + date_format[:4]
    # data[i]['fields']['date_joined_pyx'] = res
    if 'date_left_pyx' in data[i]['fields']:
      date_format = data[i]['fields']['date_left_pyx'][:data[i]['fields']['date_left_pyx'].find("T")]
      res = date_format[5:] + "-" + date_format[:4]
      data[i]['fields']['date_left_pyx'] = res
    # date_format = data[i]['fields']['date_left_pyx'][:data[i]['fields']['date_left_pyx'].find("T")]
    # res = date_format[5:] + "-" + date_format[:4]
    # data[i]['fields']['date_left_pyx'] = res

with open('client.json', 'w') as outfile:
  json.dump(data, outfile, indent=4)