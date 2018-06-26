%% localizer.m
%   The following code localizes the images by segmenting them and
%   centering them on the centroid.

function localizer
global localizerPrefix rawPrefix
dataLocations = { ...
    'Grapevine_yellow', ...
    };

localizerPrefix = 'localized';
rawPrefix = 'raw';

for i=1:length(dataLocations)
    iterateLocation( cell2mat(fullfile(dataLocations(i))) );
end

function iterateLocation( location )
global localizerPrefix rawPrefix
rawDirectory = fullfile( rawPrefix, location );
localizedDirectory = fullfile( localizerPrefix, location );
PREVDIR = cd;

% Change to directory with images
cd( rawDirectory );
% Get the images, note that dir produces a tall vector
list = [ dir( '*.jpg' ); dir( '*.JPG' ) ];
% Go back to root of this project
cd( PREVDIR );

% Use fullfile to contruct save directory name
saveDir = fullfile( PREVDIR, localizedDirectory );
if ~exist( saveDir )
    mkdir( saveDir )
else
    cd( saveDir );
    delete( '*.*' );
    cd( PREVDIR );
end

% For each image ...
for i=1:length(list)
    cd( rawDirectory );
    % Get the file name
    fileName = list(i).name;
    
    % Load the file
    im = imread( fileName );
    [ resultAugmented, n_ ] = augmentData( im );
    parfor ii=1:n_
        saveFile = fullfile( saveDir, [ 'a', num2str(ii), '-', lower(fileName) ] );
        imwrite( resultAugmented(ii).data, saveFile );
        display( [ 'Writing ' saveFile ] );
    end
    
    cd( PREVDIR );
end

% The following function should return a struct of images that have
% been randomly flipped and rotated for data augmentation purposes
function [ res, NUM_AUGS ] = augmentData( im )
NUM_AUGS = 12;
FLIP_RATE = 0.5;

for i=1:NUM_AUGS
    res(i).data = [];
end

parfor i=1:NUM_AUGS
    res(i).data = localizeImage( im );
    if rand() > FLIP_RATE
        res(i).data = fliplr( res(i).data );
    end
    res(i).data = imrotate( res(i).data, rand()*360, 'bicubic', 'crop' );
    res(i).data = imresize( res(i).data, [NaN 256] );
end

function res = localizeImage( im )
try
    imGray = rgb2gray( im );
    leafMask = imbinarize( imGray );
    leafMask = medfilt2(leafMask, [9 9]);
    leafMask = 1 - leafMask;
catch e
    error( 'Error attempting to segment leaf boundary!' );
end

try
    %% Part 1: Determine crop conditions
    vertBound = logical(max(leafMask, [], 2 ));
    horzBound = logical(max(leafMask, [], 1 ));
    vertBound = procBound( vertBound );
    horzBound = procBound( horzBound );
catch e
    error( 'Error attempting to calculate bounds of the image!' );
end

% Later we might want to center the images
res = im( vertBound, horzBound, : );

% Function selects the largest object passed
function res = procBound( bound )
boundLabels = bwlabel( bound );
stats = regionprops(bound);
stats = struct2cell(stats);
stats = stats(1,:);
[~,I] = max(cell2mat(stats));
res = boundLabels == I;
