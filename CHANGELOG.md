# Editoria  

## 1.2.0  

* Upgrade to latest Pubsweet server, client, and components  
* Introduce password reset  

#### Book Builder  
* Preview exported book in Vivliostyle Viewer  
* Chapters keep track of their own numbering (independently from parts) in the Body  
* Renaming of fragments has been removed in favour of using the title tag in Wax  
* Drag and drop fixes  

#### Wax Editor  
* Can now style multiple blocks/paragraphs at once, including lists  
* Keyboard shortcuts  
    * Turn track changes on/off => ctrl/cmd+y  
    * Hide / show tracked changes => ctrl/cmd+shift+y  
    * Comments => ctrl/cmd+m  
    * Save => ctrl/cmd+s  
* New Title style (which will also rename the fragment in the book builder)  
* New Subtitle style  
* New Bibliography Entry style  
* Revamped track changes UI: Tools are now in the toolbar instead of inline, and line height in the document has been reduced  
* Surface doesn't lose focus any more unless the user clicks outside of Wax  
* Paragraph indentation  


## 1.1.4  

#### Wax Editor  
* Fix for unsaved changes warning  


## 1.1.3  

* New design for the book builder, the dashboard and the theme  

#### Dashboard  
* Renamed 'remove' button to 'delete' for consistency with the book builder  
* Double clicking on a book will take you to the book builder for that book, instead of opening the renaming interface  
* The position of 'Edit' and 'Rename' actions have been swapped ('Edit' now comes first)  
* Books now appear in alphabetical order  

#### Book Builder  
* Fixed issue with fragments disappearing when uploading multiple files  
* Renamed 'Front Matter' and 'Back Matter' to 'Frontmatter' and 'Backmatter'  

#### Wax Editor  
* Introduce layouts  
* Accept configuration options (`layout` and `lockWhenEditing`)  
* It is now broken down into separate modules for better separation of concerns
    * Pubsweet integration  
    * React integration  
    * Core    
* Diacritics work within notes  

