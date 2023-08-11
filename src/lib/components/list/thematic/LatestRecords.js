/*
 * This file is part of GEO-Components-React.
 * Copyright (C) 2022-2023 GEO Secretariat.
 *
 * GEO-Components-React is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Button, Container, Grid, Loader, Message } from 'semantic-ui-react';

import { useQuery } from '@tanstack/react-query';

import { RecordList } from '../moldure/RecordList';
import { fetchRecords } from '../../../resources';
import { mutateRecordData } from '../base/mutations';

export const LatestRecords = ({ fetchUrl, staleTime }) => {
  const {
    data: records,
    isFetching,
    error,
  } = useQuery({
    queryKey: ['latest-records'],
    queryFn: () => {
      return fetchRecords(fetchUrl, {
        headers: {
          Accept: 'application/vnd.inveniordm.v1+json',
        },
      });
    },
    staleTime,
  });

  const mutatedRecords = !isFetching ? records.map(mutateRecordData) : [];

  return (
    <Grid>
      <Grid.Row centered>
        <Grid.Column width={10}>
          {isFetching && <Loader active inline="centered" />}

          {!isFetching && !error && (
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <RecordList records={mutatedRecords} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Container textAlign={'center'}>
                  <Button href={'/search'}>More</Button>
                </Container>
              </Grid.Row>
            </Grid>
          )}
          {error && (
            <Message content={error.message} error icon={'warning sign'} />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

LatestRecords.propTypes = {
  fetchUrl: PropTypes.string.isRequired,
  staleTime: PropTypes.number,
};

LatestRecords.defaultProps = {
  staleTime: 300000, // 5 minutes
};