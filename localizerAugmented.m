%% localizer.m
%   Use MATLAB to roughly segment and localize the leaf images.

function localizerAugmented
global localizerPrefix rawPrefix maximumImageSize
dataLocations = { ...
%     'Black_rot', ...
%     'Leaf_blight', ...
%     'Esca', ...
%     'Control', ...
    'Healthy', ...
    'Esca_captured', ...
%     'Grapevine_yellow', ... Captured, do not use locally adaptive segmentation for this
%     'Other', ... Captured, do not use locally adaptive segmentation for this
    };

maximumImageSize = 227;
localizerPrefix = 'localized2';
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

% Use fullfile to construct save directory name
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
% for i=9
    cd( rawDirectory );
    % Get the file name
    fileName = list(i).name;
    
    % Load the file
    im = imread( fileName );
    try
        [ resultAugmented, n_ ] = augmentData( im );
    catch e
        disp( [ 'Failed to augment' list(i).name ] );
    end
    
    parfor ii=1:n_
%     for ii=1:n_
        saveFile = fullfile( saveDir, [ num2str(i), '-', num2str(ii), '.jpg' ] );
        imwrite( resultAugmented(ii).data, saveFile );
%         display( [ 'Writing ' saveFile ] );
    end
    
    cd( PREVDIR );
end

% The following function should return a struct of images that have
% been randomly flipped and rotated for data augmentation purposes
function [ res, NUM_AUGS ] = augmentData( im )
global maximumImageSize
NUM_AUGS = 10;
FLIP_RATE = 0.5;

for i=1:NUM_AUGS
    res(i).data = [];
end

parfor i=1:NUM_AUGS
% for i=1:NUM_AUGS
	% Segment the leaf
    res(i).data = localizeImage( im );
    % res(i).data = im;
	% Flip the leaf
    if rand() > FLIP_RATE
        res(i).data = fliplr( res(i).data );
    end
	% Rotate the leaf
	rand_ = rand()*60 - 30;
	randx = rand()*60 - 30;
	randy = rand()*60 - 30;
    res(i).data = imrotate( res(i).data, rand_, 'bicubic', 'crop' );
    res(i).data = imtranslate( res(i).data, [randx,randy], 'FillValues', 0);
    res(i).data = imresize( res(i).data, [NaN maximumImageSize] );
end

function res = localizeImage( im )
% medFilterSize = [3 3];
% seClose = strel('disk', 5);
% blurFilter = fspecial('gaussian',3);

% For captured
medFilterSize = [11 11];
seClose = strel('disk', 15);
blurFilter = fspecial('gaussian',3);

    imGray = rgb2gray( im );
    imGray = imfilter( imGray, blurFilter );
    
    % For locally adaptive
%     leafMask = imbinarize( imGray, 'adaptive', ...
%                            'Sensitivity', 0.6, ...
%                            'ForegroundPolarity', 'dark' ); % Binarize the image
    % Nonlocally adaptive
    leafMask = imbinarize( imGray ); % Binarize the image
                       
                       
    leafMask = imclose( leafMask, seClose );
    leafMask = 1 - leafMask;
    leafMask = medfilt2(leafMask, medFilterSize); % Remove noise
    % Comment this out before running. It is only used when debugging the
    % size of the strel for binary image operations.

% try
    %% Part 1: Determine crop conditions
    vertBound = logical(max(leafMask, [], 2 ));
    horzBound = logical(max(leafMask, [], 1 ));
    vStart = find(vertBound,1,'first');
    vEnd = find(vertBound,1,'last');
    hStart = find(horzBound,1,'first');
    hEnd = find(horzBound,1,'last');
%     vertBound = procBound( vertBound );
%     horzBound = procBound( horzBound );
% catch e
%     error( 'Error attempting to calculate bounds of the image!' );
% end

% Later we might want to center the images
res = im( vStart:vEnd, hStart:hEnd, 1:3 );

% subplot(1,3,1)
% imshow( im, [] );
% subplot(1,3,2)
% imshow( leafMask, [] );
% subplot(1,3,3)
% imshow( res, [] );

% Function selects the largest object passed
% function res = procBound( bound )
% boundLabels = bwlabel( bound );
% stats = regionprops(bound);
% stats = struct2cell(stats);
% stats = stats(1,:);
% [~,I] = max(cell2mat(stats));
% res = boundLabels == I;
