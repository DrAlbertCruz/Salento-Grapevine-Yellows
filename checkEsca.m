% Some of the 'other' category of collected images contain images of Esca.
% Step through each txt file and read the disease to check if it is esca,
% if so move it to another folder.

WORK_DIR = 'D:\Salento-Grapevine-Yellows-Dataset\';
OTHER_DIR = 'D:\Salento-Grapevine-Yellows-Dataset\raw\Other\';
SAVE_DIR = 'D:\Salento-Grapevine-Yellows-Dataset\raw\Esca_captured';
ESCA_STR = 'esca disease';

% Get list of txt files
cd( OTHER_DIR );
listTxt = dir( '*.txt' );
cd( WORK_DIR );
n = length( listTxt );

% Iterate over each file
for i=1:n
    fid = fopen( fullfile( OTHER_DIR, listTxt(i).name ) );
    % Disease should be the fourth line in the text file
    fgetl(fid); fgetl(fid); fgetl(fid);
    % Trim white space, make lower
    disease(i) = { lower( strtrim( fgetl(fid) )) };
    fclose( fid );
end

disp( 'The list of diseases are: ' );
unique(disease)

% Here is where we move the files
for i=1:n
    if strcmp( cell2mat( disease(i) ), ESCA_STR )
        filenameJpeg = [ listTxt(i).name(1:(length(listTxt(i).name)-4)), ...
                         '.jpg' ];
        % Move the Jpeg only
        try 
            movefile( fullfile( OTHER_DIR, filenameJpeg ), ...
                      fullfile( SAVE_DIR, filenameJpeg ));
        catch e
            disp( 'Unable to move file. It was possibly already moved.' );
        end
    end
end