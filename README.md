## Website

https://rbx-pages.github.io/rbx-microprofiler-info


## Notes

Custom files, like certain assets go inside ``public/`` and will be copied into the build output.
And when ``npm run dev`` is ran, ``public/`` is automatically served onto the root URI as well.

So, ``public/assets`` will be ``assets/``.



## Info

Tag Descriptions use **markdown** and are parsed as such.
Using ``<h3>`` or similar, breaks the parser so ``###`` is preferred instead.

Tag Definitions are done in a separate repository under a different branch that isn't the main one, to prevent
GitHub from adding it to the search, to keep less clogged.

https://github.com/rbx-pages/rbx-microprofiler-info-json/tree/main-for-building

``dummy.ts`` can be used to update the documentation with autocomplete support. ``builerHelper.ts`` being the compansion.
Which should stay in-sync with the JSON repository.

``npm run build-tagData`` is used to build the JS output used for the JSON repository.