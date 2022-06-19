# %% [markdown]
# 此文件处理源码，找到其中的字符串并整理为 JSON。尚未完成，对于注释中的字符串和字符串字面量拼接未得到处理

# %%
f = open("../data/constraint.cc", encoding="utf-8")
content = f.read()
f.close()

# %%
import re
r = re.compile('"(.*?)"');
lis = r.findall(content)
print(lis)

# %%
import json
json.dump([{'msgid': i, 'msgstr': ''} for i in lis], open("../data/constraint.json", "w", encoding="utf-8"), indent=2)


