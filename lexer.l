alpha				[A-Za-z]
sign				[\-\+]
num					[0-9]
arrow				\:
infix				\#
seq					\;

id-base-char		{alpha} | {sign}
id-general-char		{id-base-char} | {num}
id					{id-base-char} ({id-general-char}* {id-base-char} {id-general-char}*)?
number				{sign}? {num}+ ('.' {num}+)?

%%

\s+					/* skip whitespace */
{number}			return 'NUM'
{id}				return 'ID'
{arrow}				return 'ARROW'
{infix}				return 'INFIX'
{seq}				return 'SEQ'
'('					return 'LPAREN'
')'					return 'RPAREN'
'['					return 'LSQUARE'
']'					return 'RSQUARE'
<<EOF>>				return 'EOF'
.					return 'INVALID'
