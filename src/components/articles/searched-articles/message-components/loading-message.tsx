import React from "react";
import Skeleton from '@material-ui/lab/Skeleton';

interface LoadingMessageProps {

}

const LoadingMessage: React.FC<LoadingMessageProps> = () => {
    return (
        <Skeleton variant="rect" width={'100%'} height={200} animation="wave"/>
    )
};

export default LoadingMessage