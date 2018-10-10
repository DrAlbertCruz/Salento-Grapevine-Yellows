% I dont wanna have to use node.js or php for the human recognition script,
% so this MATLAB script will rename all the files in a given directory to a
% number

parpool local

imagePath = '/home/acruz/data/Salento-Grapevine-Yellows-Dataset/localized/Black_rot';

cd( imagePath );
images = dir( '*.jpg' );

tic
parfor i=1:size(images,1)
    movefile( fullfile(images(i).folder, images(i).name), ...
       fullfile(images(i).folder, ['image-' num2str(i), '.jpg']) );
end
toc
