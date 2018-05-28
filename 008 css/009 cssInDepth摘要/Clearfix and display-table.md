Using display: table in the clearfix contains margins because of a few peculiarities
of CSS. The creation of a display-table element (or, in this case, pseudo-element)
implicitly creates a table row within the element and a table cell within that. Because
margins don’t collapse through table-cell elements (as mentioned in chapter 3), they
won’t collapse through a display-table pseudo element either.


It might seem, then, that you could use display: table-cell to the same effect.
However, the clear property only works when applied to block-level elements. A table
is a block-level element, but a table cell is not; thus, the clear property could not be
applied along with display: table-cell. Therefore, you need to use display:
table to clear floats and its implied table cell to contain the margins.