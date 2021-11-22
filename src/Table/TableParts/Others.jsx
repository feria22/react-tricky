import React, { useState, useEffect,useMemo,useCallback } from 'react';


function scrollbarWidth () {
    const scrollDiv = document.createElement('div')
    scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;')
    document.body.appendChild(scrollDiv)
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    document.body.removeChild(scrollDiv)
    return scrollbarWidth
}

function useControlledState(state, { instance }) {
    return useMemo(() => {
        if (state.groupBy.length) {
        return {
            ...state,
            hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
            (d, i, all) => all.indexOf(d) === i
            ),
        }
        }
        return state
    }, [state])
}

export {useControlledState,scrollbarWidth}
