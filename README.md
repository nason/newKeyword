````javascript
  Constuctor-ish function that uses new
    using new
      context
        ✓ should maintain the correct context with regard to the returned object
      arguments
        X1) should pass a direct reference for arguments through
      constructor property
        ✓ should set the constructor correctly
    not using new
      context
        ✓ should maintain the correct context with regard to the returned object
      arguments
        X2) should pass a direct reference for arguments through
      constructor property
        ✓ should set the constructor correctly

  Constructor-ish function that uses apply
    using new
      context
        ✓ should maintain the correct context with regard to the returned object
      arguments
        ✓ should pass a direct reference for arguments through
      constructor property
        X3) should set the constructor correctly
    not using new
      context
        ✓ should maintain the correct context with regard to the returned object
      arguments
        ✓ should pass a direct reference for arguments through
      constructor property
        X4) should set the constructor correctly

  Constructor-ish function that uses Object.create and apply
    using new
      context
        ✓ should maintain the correct context with regard to the returned object
      arguments
        ✓ should pass a direct reference for arguments through
      constructor property
        ✓ should set the constructor correctly
    not using new
      context
        ✓ should maintain the correct context with regard to the returned object
      arguments
        ✓ should pass a direct reference for arguments through
      constructor property
        ✓ should set the constructor correctly
````