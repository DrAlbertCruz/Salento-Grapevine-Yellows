% I dont wanna have to use node.js or php for the human recognition script,
% so this MATLAB script will rename all the files in a given directory to a
% number

imagePath = '/home/acruz/data/Salento-Grapevine-Yellows-Dataset/localized/Black_rot';

cd( imagePath );
images = dir( '*.jpg' );

for i=1:size(images,1)
    unix( [ 'cp ', ...
        fullfile(images(i).folder, images(i).name), ' ' ...
        fullfile(images(i).folder, [num2str(i), '.jpg']) ] );
    unix( [ 'rm ', ...
        fullfile(images(i).folder, images(i).name) ] );
    display( [ num2str(i) '/' num2str(size(images,1)) ] );
        
    %movefile( fullfile(images(i).folder, images(i).name), ...
    %    fullfile(images(i).folder, [num2str(i), '.jpg']) );
end
