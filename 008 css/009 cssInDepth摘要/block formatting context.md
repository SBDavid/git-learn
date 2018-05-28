A block formatting context (sometimes called a
BFC) is a region of the page in which elements are laid out. A block formatting context itself is part of the surrounding document flow, but it isolates its contents from
the outside context. This isolation does three things for the element that establishes
the BFC:

- 1 It contains the top and bottom margins of all elements within it. They won’t collapse with margins of elements outside of the block formatting context.
- 2 It contains all floated elements within it.
- 3 It doesn’t overlap with floated elements outside the BFC

Put simply, the contents inside a block formatting context will not overlap or interact
with elements on the outside as you would normally expect. If you apply clear to an
element, it’ll only clear floats within its own BFC. And, if you force an element to have
a new BFC, it won’t overlap with other BFCs

You can establish a new block formatting context in several ways. Applying any of
the following property values to an element triggers one:

 float: left or float: right—anything but none
 overflow: hidden, auto, or scroll—anything but visible
 display: inline-block, table-cell, table-caption, flex, inline-flex,
grid, or inline-grid—these are called block containers.
 position: absolute or position: fixed