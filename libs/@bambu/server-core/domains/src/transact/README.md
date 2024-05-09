# @bmbu/server-transact/domains

This package is concerned with domain entities defined in relation to transact.

Domain entities at the server-core level are meant to be of a certain level of abstraction
and genericity, and they should encapsulate flows common to all apps.

By Johannes:

Domain modules in this subfolder are earmarked for refactoring into a distinct package. @bambu/server-transact/domains

The reason why I have not done so yet is that there is a lot of ceremony in creating a new package
and I do not want to bother with discovering what could go wrong with that in this point in time.