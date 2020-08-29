# contributing

thanks for using iexcli. contributions are welcome. whether or not you are
considering [contributing code](#code-contributions), please file an issue.
templates are not required.

please try to be respectful of other members of the community and yourself.

### features

please file a [feature
request](https://github.com/HP4k1h5/iexcli/issues/new?assignees=&labels=&template=feature_request.md&title=)

### bugs

im sorry. please file a [bug report](https://github.com/HP4k1h5/iexcli/issues/new?assignees=HP4k1h5&labels=bug&template=bug_report.md&title=basic)

## code contributions

When contributing code, please:
1) file an issue and describe the bugfix or feature
2) fork this repository
3) checkout the latest version branch, which will be in the `v.X.X.X` format,
and should be the only version branch available. Don't hesitate to ask if it
is unclear.
4) make changes
5) submit a merge request from your forked branch into the
latest HP4k1h5/iexcli `v.X.X.X` branch.

## tests

there are no real tests in this repository yet. there are some quick visual
and print checks, but it is almost impossible to replicate the things about
this app that break most easily and that cause user frustration, such as
losing input focus when you don't expect, windows appearing after carousel
workspace switches because of data latency, and the list goes on.

testing the shaping of things while so much is still in development and will
need to adapt to various user terminal setups is not ideal. i'd rather not
keep updating tests to ensure "it basically looks right on some monitors".
once i have an idea of the kinds of things that easily break a user's
expectations, i can hopefully test against that.
