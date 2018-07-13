% For all JPEG images in a directory, rename them to their MD5 checksum.
% This will also remove duplicate images.
FILE_LOCATION = 'D:\Salento-Grapevine-Yellows-Dataset\localized2\Esca_captured';
WORK_DIR = 'D:\Salento-Grapevine-Yellows-Dataset';

% Get list of files
cd( FILE_LOCATION );
list = dir( '*.jpg' );
n = length(list);   % Number of images
cd( WORK_DIR );

parfor i=1:n
    % Read the image
    im = imread( fullfile( FILE_LOCATION, list(i).name ) );
    % Vectorize it
    im = im(:);
    Opt = struct( 'Format', 'hex', ...
                  'Input', 'array');
    newFileName = [ DataHash( im, Opt ), '.jpg' ];
    
    [S, M, ~] = movefile( fullfile( FILE_LOCATION, list(i).name ), ...
                          fullfile( FILE_LOCATION, newFileName ), ...
                          'f' );
    display( [ num2str(i) '/' num2str(n) ] );
end