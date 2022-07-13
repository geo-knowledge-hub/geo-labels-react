/*
 * This file is part of GEO-Components-React.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Components-React is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Formik } from 'formik';

import { Button, Form, Modal } from 'semantic-ui-react';

import { i18next } from '@translations/i18next';

import { FilterTabs } from './FilterTabs';
import { StaticQueryStringSerializer } from './serializers';

/**
 * Filter Builder modal component.
 * @constructor
 *
 * @param {String} modalTitle Filter builder Modal title
 * @param {React.ReactNode} modalTrigger Element used to open the Filter builder modal.
 * @param {Object} modalConfig Configuration object for the Modal FilterBuilder.
 * @param {Object} formInitialValues Initial values for the Formik Form.
 * @param {Function} formOnApplyFilter Function to be called when the filters are defined.
 * @returns {JSX.Element}
 */
export const FilterBuilder = ({
  modalTitle,
  modalTrigger,
  modalConfig,
  formInitialValues,
  formOnApplyFilter,
}) => {
  // States
  const [modalOpen, setModalOpen] = useState(false);
  const [advancedFilterModeEnabled, setAdvancedFilterModeEnabled] =
    useState(false);

  // Auxiliary functions
  const enableAdvancedFilter = () => setAdvancedFilterModeEnabled(true);
  const disableAdvancedFilter = () => setAdvancedFilterModeEnabled(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const serializeQuery = (values) => {
    // todo: implement the advanced mode. By now, only the simple version is
    //       supported.

    // basic serializer (static)
    const staticSerializer = new StaticQueryStringSerializer();
    return staticSerializer.serialize(values);
  };

  return (
    <Formik initialValues={formInitialValues} onSubmit={() => {}}>
      {({ values, errors, handleSubmit, isSubmitting }) => (
        <Modal
          closeIcon
          open={modalOpen}
          onOpen={openModal}
          onClose={closeModal}
          trigger={modalTrigger}
          {...modalConfig}
        >
          <Modal.Header>{modalTitle}</Modal.Header>
          <Modal.Content>
            <Form onSubmit={handleSubmit}>
              <FilterTabs />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            {advancedFilterModeEnabled ? (
              <Button
                name={'enableFilter'}
                onClick={disableAdvancedFilter}
                icon={'cogs'}
                content={i18next.t('Basic mode')}
                floated={'left'}
              />
            ) : (
              <Button
                name={'disableFilter'}
                onClick={enableAdvancedFilter}
                icon={'cogs'}
                content={i18next.t('Advanced mode')}
                floated={'left'}
                disabled={true}
              />
            )}
            <Button color="gray" onClick={closeModal}>
              {i18next.t('Cancel')}
            </Button>
            <Button
              content={i18next.t('Use filters')}
              labelPosition={'right'}
              icon={'checkmark'}
              type={'submit'}
              onClick={() => {
                closeModal();
                formOnApplyFilter(serializeQuery(values));
              }}
              positive
            />
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

FilterBuilder.propTypes = {
  modalTitle: PropTypes.string.isRequired,
  modalTrigger: PropTypes.node.isRequired,
  modalConfig: PropTypes.object,
  formInitialValues: PropTypes.object,
  formOnApplyFilter: PropTypes.func.isRequired,
};

FilterBuilder.defaultProps = {
  modalTitle: i18next.t('Search filter'),
  modalConfig: {},
  formInitialValues: {},
};
