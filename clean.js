var path = require ('path');
var fs = require ('fs');
var ncp = require('ncp').ncp;

function clean (source_loc, callback)
{

fs.readdir(source_loc, function (err, files)
{
	if(err)
	{
        console.log('Invalid Path :');
        throw err;
	}
	else
	{
		files.forEach(function(file)
		{
			var ext = file.split('.').pop();

			if (ext == file) 
			{
				if (ext[0] == '_')
				{
					return ;
                }
                var dst_loc = path.join(source_loc,"_others");

                if (!fs.existsSync(dst_loc)){
                    fs.mkdirSync(dst_loc);
                }

                fs.readdir(path.join(source_loc, ext),function (err, f)
                {
                    if (err)
                    {
                        
                        fs.copyFile(path.join(source_loc,ext), path.join(dst_loc,ext), (err) => {
                            if (err) 
                                {
                                   throw err;
                                   console.log('error while copying file :'+ err);
                               }
                            console.log('File was copied to destination :'+path.join(dst_loc, ext));
          
                            fs.unlink(path.join(source_loc,file), function (err) {
                              if (err) 
                                  {
                                      throw err;
                                      console.log('error while deleting file :'+err);
                                  }
                              
                                  console.log('File deleted from old location');
                              }); 
                          });
                    }
                    else
                    {
                        ncp(path.join(source_loc,file), path.join(dst_loc,file), function (err) {
                            if (err) {
                              //return console.error(err);
                              fs.unlink(path.join(source_loc,file), function (err) {
                              if (err) 
                                  {
                                      throw err;
                                      console.log('error while deleting file :'+err);
                                  }
                              
                                  console.log('File deleted from old location');
                              });
                            }
                            else{
                            console.log('Copying folders complete.:'+path.join(source_loc,file));
      
                            delete_folder(path.join(source_loc,file), function(err)
                              {
                                  if(err)
                                  {
                                      throw error;
                                  }
                                  else
                                  {
                                      fs.rmdir(path.join(source_loc,file), function(err)
                                      {
                                          if(err)
                                              throw err;
                                          else
                                          {
                                              console.log('Folder deleted from old location :'+path.join(source_loc,file));
                                          }
                                      });
                                      
                                  }
                              });
                          }
                          });
                    }
                });
			}

			else
			{

				if(ext != file){
				ext = "_"+ext;
				var dst_loc = path.join(source_loc,ext);

					if (!fs.existsSync(dst_loc)){
					    fs.mkdirSync(dst_loc);
					}
				}
			

				fs.copyFile(path.join(source_loc,file), path.join(dst_loc,file), (err) => {
				  if (err) 
				  	{
				 		throw err;
				 		console.log('error while copying file :'+err);
				 	}
				  console.log('File was copied to destination :'+path.join(dst_loc,file));

				  fs.unlink(path.join(source_loc,file), function (err) {
				    if (err) 
				    	{
				    		throw err;
				    		console.log('error while deleting file :'+err);
				    	}
				    
				    	console.log('File deleted from old location');
					}); 
				});
			}

		});

	}
});
callback();
}
function delete_folder(source_loc, callback)
{
	
	fs.readdir(source_loc, function (err, files)
	{
	if(err)
	 throw err;

	var l = files.length;
	console.log('total length in '+source_loc+':'+l);

	files.forEach(function(file)
	{
		var ext = file.split('.').pop();

		if(ext == file)
		{
			delete_folder(path.join(source_loc,file), function(err)
			{
				if(err)
				{
					throw error;
				}
				else
				{
					fs.rmdir(path.join(source_loc,file), function(err)
					{
						if(err)
							throw err;
						else
						{
							console.log('Folder deleted from old location :'+path.join(source_loc,file));
						}
					});
					console.log('files.length :'+files.length);
					l=l-1;
					if (l == 0) {
			           console.log('calling callback function');
			           callback(err);
			           }
				}
			});
		}
		else
		{
			fs.unlink(path.join(source_loc,file), function (err) {
				if (err) 
				{
					throw err;
					console.log('error while deleting file :'+err);
				}
				else
				{
					console.log('files successfully deleted :'+path.join(source_loc,file));

					console.log('files.length in loc '+source_loc+':'+files.length);
					l=l-1;
					if (l==0) {
			           console.log('calling callback function');
			           callback(err);
		           }
				}
				
	        });
	        
		} 
	});
	
     
	});
}
exports.clean = clean;