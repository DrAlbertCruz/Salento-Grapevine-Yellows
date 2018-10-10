% I dont wanna have to use node.js or php for the human recognition script,
% so this MATLAB script will rename all the files in a given directory to a
% number

% Assume that parpool is open

for imageClass = { 'GY', 'Healthy', 'Other' }

   imagePath = fullfile( '/home/acruz/data/Salento-Grapevine-Yellows-Dataset/raw', ...
      cell2mat(imageClass) );

   cd( imagePath );
   images = dir( '*.jpg' );

   tic
   for i=1:size(images,1)
      movefile( fullfile(images(i).folder, images(i).name), ...
         fullfile(images(i).folder, ['image-' num2str(i), '.jpg']) );
   end
   toc
end
