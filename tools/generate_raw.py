# %% [markdown]
# 此代码处理 gettext PO 文件。缺陷：对于复数形式的 msgid 无法处理

# %%
f = open("../data/zh_CN.po", encoding="utf-8")
content = f.read()
f.close()

# %%
content = content.replace("\"\n\"", "")
print(content)

# %%
lines = content.split("\n")
lines = list(filter(lambda x: not(x == "#" or x.startswith("# ") or x.startswith("#~ ")), lines))
# print(lines)

# %%
blocks = [[]]
for i in lines:
    if i == "":
        blocks.append([])
        continue
    blocks[-1].append(i)
# print(blocks)
    

# %%
blocks_with_tag = []
for i in blocks:
    block_with_tag = dict({ "references" : [] })
    for j in i:
        if j.startswith("#: "):
            remaind: str = j[3:]
            references = remaind.split(" ")
            block_with_tag["references"].extend(references)
        elif j.startswith("#, "):
            remaind: str = j[3:]
            flags = remaind.split(",")
            block_with_tag["flags"] = list(map(lambda x:x.strip(), flags))
        elif j.startswith("msgid "):
            remaind: str = j[6:]
            block_with_tag["msgid"] = remaind.strip('"')
        elif j.startswith("msgstr "):
            remaind: str = j[7:]
            block_with_tag["msgstr"] = remaind.strip('"')
    blocks_with_tag.append(block_with_tag)
# print(blocks_with_tag)


# %%
# filter the c-family and cp relatives

def predicate(block):
    if "references" not in block:
        return False
    files = block["references"]
    prefixes = ["c-family/", "cp/", "tree-ssa-", "diagnostic"]
    return any(any(f.startswith(p) for p in prefixes) for f in files)

filtered = list(filter(predicate, blocks_with_tag))
# print(filtered)

# %%
print(len(filtered))

def get_mini(block):
    return {
        # "flags": ', '.join(block.get("flags",[])),
        "references": ', '.join(block["references"]),
        "msgid": block["msgid"],
        "msgstr": block.get("msgstr","")
    }

mini = list(map(get_mini, filtered))

import json

with open("../data/raw_result.json", "w", encoding="utf-8") as f:
    json.dump(mini, f, ensure_ascii=False, indent=2)


