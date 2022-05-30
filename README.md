# gcc-translation

试图将 g++ 的编译诊断信息翻译为中文。

## 适用范围

仅考虑 g++ 在编译 C++ 源文件时的输出。

目前支持的版本如下：未来可能增加新版本支持，但也可能不增加。
- GCC 11.2.0
- GCC 12.1.0

## 效果

#### 原文
![](https://z3.ax1x.com/2021/08/26/hueyi4.png)

#### 翻译后
![](https://z3.ax1x.com/2021/08/26/hue6JJ.png)

## 翻译过程介绍

基于 gcc 的 NLS （本地语言支持），首先获取该版本的 `zh_CN.po`。此文件内存放了数万个可以被本地化的字符串，并提供了其中一部分的中文翻译。通过 `tools` 下的乱七八糟的脚本将这数万个字符串整理，筛选可能会出现在 C++ 编译诊断信息的字符串，一共约四千余条。将这四千余条英文手动翻译为中文。对于使用了格式化字符串的，使用正则表达式代替。此为 `src` 下的大头 JSON 来源。

对于未被 NLS 处理的字符串，则无法在 `zh_CN.po` 中找到。此时需要手动查看 gcc 源码，并将其逐一翻译为中文，存放到 `src` 下。

翻译完成后，将这四千条“正则表达式样式”-“对应中文”按字符串长度从长到短逐一替换诊断信息中的英文。

为了简便起见，形如 `'typedef-name' {aka 'original-name'}` 的格式 `%qT` 被简化为 `'(.+?)'`。这会导致带有 `aka` 的诊断信息无法被合理替换，因此需要在替换前后对其做处理，细节参见 `index.mjs`。

## 术语表（待补充）

部分翻译为了防止混淆，夹带了私货：

| 英文        | 通常翻译       | 选用翻译 |
| ----------- | -------------- | -------- |
| attribute   | 属性           | 特性     |
| catch       | 捕获           | 捕捉     |
| const       | 常（量）       | 只读     |
| deallocate  | 解分配         | 释放     |
| dereference | 提领，逆向引用 | 解地址   |
| promise     | 承诺           | 期约     |
| trait       | 特性           | 特征     |

大量术语采取了和 CppReference 相同的翻译：

| 英文                    | 翻译             |
| ----------------------- | ---------------- |
| access                  | （可）访问（性） |
| aggregate               | 聚合类型，聚合体 |
| argument                | 实参             |
| binary                  | 二元             |
| brace                   | 花括号           |
| copy                    | 复制             |
| defaulted               | 预置（的）       |
| exception specification | 异常说明         |
| explicit                | 显式的           |
| ...-id                  | ...标识          |
| identifier              | 标识符           |
| initializer             | 初始化器         |
| linkage                 | 连接             |
| literal                 | 字面类型，字面量 |
| mutable                 | 可变的           |
| specifier               | 说明符           |
| overload resolution     | 重载决议         |
| override                | 覆盖             |
| parameter               | 形参             |
| pointer-to-member       | 成员指针         |
| qualifier               | 限定符           |
| unary                   | 一元             |
| union                   | 联合体           |
| volatile                | 易变的           |
