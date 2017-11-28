%% localizer.m
%   The following code localizes the images by segmenting them and
%   centering them on the centroid.

function localizer
global localizerSuffix
dataLocations = { ...
    'G:\NextCloud\grapes_2017\data\vitis_vinefera', ...
    'G:\NextCloud\grapes_2017\data\vitis_vinifera_grapevine_yellow', ...
    'G:\NextCloud\grapes_2017\data\vitis_vinifera_other_diseases' };

localizerSuffix = 'localized';

for i=1:length(dataLocations)
    iterateLocation( cell2mat(dataLocations(i)) )
end

function iterateLocation( location )
global localizerSuffix
PREVDIR = cd;

cd( location );

list = dir( '*.jpg' );

for i=1:length(list)
    fileName = list(i).name;
    saveDir = [ location, '\', localizerSuffix ];
    if ~exist( saveDir )
        mkdir( saveDir )
    end
    saveFile = [ saveDir, '\', fileName ];
    
    im = imread( fileName );
    result = localizeImage( im );
    
    imwrite( result, saveFile );
    display( [ 'Writing ' saveFile ] );
end

function res = localizeImage( im )
try
imGray = rgb2gray( im );
leafMask = imbinarize( imGray );
leafMask = medfilt2(leafMask, [9 9]);
leafMask = 1 - leafMask;

%% Part 1: Determine crop conditions
vertBound = logical(max(leafMask, [], 2 ));
horzBound = logical(max(leafMask, [], 1 ));
vertBound = procBound( vertBound );
horzBound = procBound( horzBound );

% Later we might want to center the images
res = im( vertBound, horzBound, : );
catch e
    display( 'Hmmm!' );
end

function res = procBound( bound )
boundLabels = bwlabel( bound );
stats = regionprops(bound);
stats = struct2cell(stats);
stats = stats(1,:);
[~,I] = max(cell2mat(stats));
res = boundLabels == I;