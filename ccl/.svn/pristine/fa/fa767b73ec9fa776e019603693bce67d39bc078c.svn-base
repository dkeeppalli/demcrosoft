<?php

class DBConnectionTrans
{
	private $autocommit ;
	private $tranflag = FALSE ;
	private $conn ;

	/**
	 * Constructor needs the Database information.
	 *
	 * @param string $host
	 * @param string $username
	 * @param string $password
	 * @param string $dbname
	 * @return DBConnection	object.
	 * 
	 */
	public function __construct($host, $username, $password, $dbname)
	{
		if (!($this->conn = mysqli_connect($host, $username, $password)))
		{
			return false;
		}

		if (!mysqli_select_db($this->conn, $dbname))
		{
			return false;
		}
		
		$this->conn->set_charset("utf8");

		$this->setAutoCommitStatus(FALSE);
	}

	/**
	 * Cleans up the connection.
	 *
	 */
	public function __destruct()
	{
		/**
		 * The following code generates a PHP Warning on the production box. Looks like, due to a PHP bug,
		 * The connection is being cleaned up even before the destructor is ever called. For the time being
		 * we dont clean up the connection in the destructor.
			mysqli_close($this->conn);
		 */
	}
	
	
	/**
	 * Begins a transaction context.
	 *
	 * @return boolean	TRUE on success, FALSE on failure.
	 */
	public function beginTransaction()
	{
		if ($this->autocommit == TRUE)
		{
			$this->setAutoCommitStatus(FALSE);
		}
		
		$this->tranflag = TRUE ;
		return TRUE ;
	}
	
	/**
	 * Commits a transaction.
	 *
	 * @return boolean	TRUE on success, FALSE on failure.
	 */
	public function commitTransaction()
	{			
		if (!mysqli_commit($this->conn))
		{
			return false;
		}
		
		$this->tranflag = FALSE ;
		return TRUE ;
	}
	
	/**
	 * Rolls back the current transaction.
	 *
	 * @return boolean		TRUE on success, false on failure.
	 */
	public function abortTransaction()
	{
		if ($this->tranflag == FALSE)
		{
			// Simply return, since we dont have a transaction going on.
			return TRUE;
		}
		
		if (!mysqli_rollback($this->conn))
		{
			// we shouldnt really be throwing an exception here. We might already be in
			// a catch block. Hence just log the error and return.
			echo "Failed to rollback transaction: " . mysqli_connect_error();
		}
		
		$this->tranflag = FALSE ;
		return TRUE ;
	}
	
	
	/**
	 * This method returns whether we are currently in the middle of a transaction.
	 * This is used especially when inter-dependent modules have to check whether we
	 * are in the middle of a transaction, otherwise begin a new transaction.
	 *
	 * @return unknown
	 */
	public function inTransaction()
	{
		return $this->tranflag;
	}

	/**
	 * method to turn on or off auto commiting database modifications 
	 *
	 * @param boolean $flag		to turn on or off
	 * @return TRUE				if its commited the return TRUE 
	 */
	private function setAutoCommitStatus($flag)
	{
		if (!mysqli_autocommit($this->conn, $flag))
		{
			return false;
		}
		
		$this->autocommit = $flag ;
		return TRUE ;
	}


	/**
	 * This method is used to execute a query which is expected to return a single value (single row, single column)
	 * A Helper function such that the caller doesnt have to deal with cleaning up the result sets etc.
	 * It is the responsibility of the caller to ensure that only a single value is expected. Additional rows and columns
	 * are discarded - only the first row, first column is returned if more than one row/column are returned from the DB.
	 *
	 * @param string $querystr	SQL Query to be executed (must be a select statement, but no validation is performed).
	 * @return mixed			A single value that is expected of the query.
	 */
	public function singleResultQuery($querystr)
	{
		if (($resultset = $this->singleRowQuery($querystr)) == FALSE
			|| count($resultset) < 1)
			return FALSE ; // We must've already complained.

		// The result set is an assoc array, representing the query results
		if (count($resultset) > 1)
			echo "More than one column returned. Only first column returned - ignoring others.";
		
		foreach ($resultset as $key => $value)
		{
			// We only need the first one. We dont care about others.
			return $value ;
		}
		
		// if we reach here, something wrong.
		//echo "Failed to retrieve any value.";
		return FALSE;
	}

	/**
	 * This method is used to execute a query which is expected to return a single row
	 * A Helper function such that the caller doesnt have to deal with cleaning up the result sets etc.
	 * It is the responsibility of the caller to ensure that only a single row is expected. Additional rows
	 * are discarded - only the first row is returned if more than one row are returned from the DB.
	 *
	 * @param string $querystr	SQL Query to be executed (must be a select statement, but no validation is performed).
	 * @return array			An associative array that is keyed by the column names.
	 */
	public function singleRowQuery($querystr)
	{
		$result = $this->queryDB($querystr);
				
		$returnValues = mysqli_fetch_assoc($result);
		if ($returnValues == FALSE)
		{
				//echo "Failed to retrieve any value.";
				return FALSE ;
		}
		
		mysqli_free_result($result);
		return $returnValues;
	}

	/**
	 * This method is used to execute a query which is expected to return a single column (possibly multiple rows)
	 * A Helper function such that the caller doesnt have to deal with cleaning up the result sets etc.
	 * It is the responsibility of the caller to ensure that only a single column is expected. Additional columns
	 * are discarded - only the first column is returned if more than one column are returned from the DB.
	 *
	 * @param string $querystr	SQL Query to be executed (must be a select statement, but no validation is performed).
	 * @return array			A numerical array that contains the values returned. The column name is NOT returned.
	 * 
	 */
	public function singleColumnQuery($querystr)
	{
		if (($resultset = $this->multiValueQuery($querystr)) == FALSE)
			return FALSE ; // We must've already complained.

		// The result set is a 2-dimensional array, representing the query results
		// First row is an array of fields. How many did we get?
		if (count($resultset[0]) > 1)
			echo "More than one column returned. Only first column returned - ignoring others.";
		
		// Delete the first row which is field headers.
		array_shift($resultset);
		
		$arrResult	= array();
		foreach( $resultset as $value )
			$arrResult[]	=	$value[0];		
		
		return $arrResult;
	}

	/**
	 * This method is a helper function such that the caller doesnt have to deal with cleaning up the result sets etc.
	 * The method executes a SQL query and returns the result sets in a 2-dimensional array. The first row of the
	 * 2D array is the column names and the remaining rows are the results.
	 *
	 * @param string $querystr	SQL Query to be executed (must be a select statement, but no validation is performed).
	 * @return array			A 2-dimensional array (matrix) of results. The first row $resultset[0] is an array of column names
	 * 							and the remaining rows ($resultset[1..n]) are the values.
	 */
	public function multiValueQuery($querystr)
	{		
			$result = $this->queryDB($querystr);		
			$resultset = array();
			
			$fields = mysqli_fetch_fields($result) ;
			if (FALSE == $fields)
			{
				return false;
			}
			$resultset[0] = $fields ;
			
			while (($rowVals = mysqli_fetch_row($result)) != FALSE)
			{
				$resultset[] = $rowVals ;
			}			
			mysqli_free_result($result);
			return $resultset;		
	}

	/**
	 * This m
	 * ethod is a helper function such that the caller doesnt have to deal with cleaning up the result sets etc.
	 * The method executes a SQL query and returns the result sets in a 2-dimensional array. The first row of the
	 * 2D array is the column names and the remaining rows are the results.
	 *
	 * @param string $querystr	SQL Query to be executed (must be a select statement, but no validation is performed).
	 * @return array			A 2-dimensional array (matrix) of results. The first row $resultset[0] is an array of column names
	 * 							and the remaining rows ($resultset[1..n]) are the values.
	 */
	public function multiAssocQuery($querystr)
	{
		$result = $this->queryDB($querystr);
		
		$resultset = array();
		
		while (($rowVals = mysqli_fetch_assoc($result)) != FALSE)
		{
			$resultset[] = $rowVals ;
		}
		
		mysqli_free_result($result);
		return $resultset;
	}
		
	/**
	 * This method is a helper function such that the caller doesnt have to deal with cleaning up the result sets etc.
	 * The method executes a SQL query and returns the result set as an objects. The column names are represented
	 * by the object members.
	 *
	 * @param string $querystr	SQL Query to be executed (must be a select statement, but no validation is performed).
	 * @return Object			An object that corresponds to the first row in the result set, and the object members
	 * 							are column names.
	 */
	public function singleObjectQuery($querystr)
	{
		$result = $this->queryDB($querystr);

		if (($rowObject = mysqli_fetch_object($result)) == NULL)
		{
				//echo "Failed to retrieve any value.";
		}

		mysqli_free_result($result);
		return $rowObject;
	}

	
	/**
	 * This method is a helper function such that the caller doesnt have to deal with cleaning up the result sets etc.
	 * The method executes a SQL query and returns the result sets as an array of objects. The column names are represented
	 * by the object members.
	 *
	 * @param string $querystr	SQL Query to be executed (must be a select statement, but no validation is performed).
	 * @return array			An array objects. Each object corresponds to a row in the table, and the object members
	 * 							are column names.
	 */
	public function multiObjectQuery($querystr)
	{
		$result = $this->queryDB($querystr);

		$resultset = array();
		
		while (($rowObject = mysqli_fetch_object($result)) != NULL)
		{
			$resultset[] = $rowObject ;
		}

		mysqli_free_result($result);
		return $resultset;
	}

	
	/**
	 * Inserts a row (specified by the SQL String) and returns the last_insert_id() value.
	 * Generally used for tables with an AUTO_INCREMENT column -- to return the value that is just inserted.
	 * Used extensively for ID Generation.
	 *
	 * @param string $insertSQL		SQL String with the insert statement. No validation is performed.
	 * @return int					The last_insert_id() value.
	 */
	public function insertAndReturnId($insertSQL)
	{
		$this->checkTranStatus();
		
		$this->queryDB($insertSQL);
		
		return mysqli_insert_id($this->conn);
	}
	
	/**
	 * method to insert single row into database. Sql query string is built up based 
	 * on the following parameters
	 *
	 * @param string $table				name of the table.
	 * @param array $columnnames		a simple array of column names.
	 * @param array $rowvals			a simpel array of column values 
	 * @param boolean $inTranFlag		FALSE to indicate an autocommit
	 */
	public function insertSingleRow($table, $columnnames, $rowvals)
	{
		$rowvals	=	array(0 => $rowvals);	//	make it two dimensional array.		
		return  $this->insertMultipleRow($table, $columnnames, $rowvals);
	}
	
	/**
	 * Inserts a multiple row into the database. The SQL string is built up based on the parameters.
	 * Can implicitly commit (autocommit) based on the flags.
	 *
	 * @param string $table			name of the table
	 * @param array $columnnames	a simple array of column names
	 * @param array $rowvals		a simple array of column values (the order must match the column names array). Please note that datetime values are passed in as an associative array.
	 * @param array $types			a simple array of column types (in the same order). "string"/"datetime"/"int" are currently supported.
	 * @return mixed				FALSE if failure, number of rows (1) inserted if success.
	 */
	public function insertMultipleRow($table, $columnnames, $rowvals)
	{	
		$insertSQL = $this->buildMultipleInsertSQL($table, $columnnames, $rowvals);
		
		$this->checkTranStatus();
		
		$result = $this->queryDB($insertSQL);
		
		if (count($rowvals) != mysqli_affected_rows($this->conn))
		{
			return false;
		}
		
		return count($rowvals) ;
	}	
	
	/**
	 * Performs a complex insert specified by the SQL passed in. The entire SQL to insert is passed
	 * in, so we dont have to parse anything. We only have to process the result set if any.
	 *
	 * @param string $insertSQL		SQL to execute.
	 * @return mixed				FALSE if failure, number of rows (1) inserted if success.
	 */
	public function insertComplexSQL($insertSQL)
	{	
		$this->checkTranStatus();
		
		$result = $this->queryDB($insertSQL);
		
		return mysqli_affected_rows($this->conn) ;
	}	
	
	
	/**
	 * This method simulates the upsert command provided by some databases. Essentially, rows are
	 * attempted to be inserted and if they already exist, the rows are updated with the corresponding
	 * values. In MySQL similar functionality is achieved by "insert ... on duplicate key update"
	 * command. The parameters required are very similar to that of the insert (multiple rows) method
	 * with an additional parameter providing the names of the columns to be updated if the rows
	 * already exist.
	 *
	 * @param string $table			name of the table
	 * @param array $columnnames	a simple array of column names
	 * @param array $rowvals		a simple array of column values (the order must match the column names array). Please note that datetime values are passed in as an associative array.
	 * @param array $types			a simple array of column types (in the same order). "string"/"datetime"/"int" are currently supported.
	 * @return mixed				FALSE if failure, number of rows (1) inserted if success.
	 * @return int					number of rows inserted -- creaful with this: the number changes depending
	 * 									on whether the row was inserted (1 for every inserted row) OR the row was
	 * 									updated (2 for every updated row).
	 */
	public function upsertRows($table, $columnnames, $rowvals, $updateCols)
	{
		$insertSQL = $this->buildMultipleInsertSQL($table, $columnnames, $rowvals);
		
		$insertSQL .= " ON DUPLICATE KEY UPDATE " ;
		
		foreach ($updateCols as $columnName)
		{
			$insertSQL .= $columnName . " = VALUES(" . $columnName . ") , " ;
		}
		
		$insertSQL = substr($insertSQL, 0, -2);
		
		$this->checkTranStatus();
		
		$result = $this->queryDB($insertSQL);
		
		return mysqli_affected_rows($this->conn) ;
	}

	
	/**
	 * Updates a table.
	 *
	 * @param string $table				Table name.
	 * @param array $columnnames		array of column names to be updated
	 * @param array $rowvals			array of values corresponding to the column names above.
	 * @param string $condition			WHERE clause (without the WHERE).
	 * @return int						number of rows updated.
	 */
	public function updateTable($table, $columnnames, $rowvals, $condition)
	{
		// Do some validation for the $condition. This should NOT be empty or we are updating the
		// entire table by mistake. If you truly need to update the entire table without a where
		// clause, $condition should be passed in as "   " (with some spaces).
		if ($condition == "")
		{
			return false;
		}
		$sql = $this->buildUpdateSQL($table, $columnnames, $rowvals, $condition) ;
		$this->checkTranStatus();
		$this->queryDB($sql);
		return mysqli_affected_rows($this->conn) ;
	}

	/**
	 * Updates a table using the Ignore clause.
	 *
	 * @param string $table				Table name.
	 * @param array $columnnames		array of column names to be updated
	 * @param array $rowvals			array of values corresponding to the column names above.
	 * @param string $condition			WHERE clause (without the WHERE).
	 * @return int						number of rows updated.
	 */
	public function updateTableIgnore($table, $columnnames, $rowvals, $condition)
	{
		// Do some validation for the $condition. This should NOT be empty or we are updating the
		// entire table by mistake. If you truly need to update the entire table without a where
		// clause, $condition should be passed in as "   " (with some spaces).
		if ($condition == "")
		{
			return false;
		}
		$sql = $this->buildUpdateSQL($table, $columnnames, $rowvals, $condition, TRUE /* IGNORE FLAG */) ;
		$this->checkTranStatus();
		$this->queryDB($sql);
		return mysqli_affected_rows($this->conn) ;
	}
	

	/**
	 * Deletes rows from the table
	 *
	 * @param string $table			Tablename
	 * @param string $condition		WHERE clause without the WHERE.
	 * @return int					number of rows deleted.
	 */
	public function deleteTable($table, $condition)
	{
		// Do some validation for the $condition. This should NOT be empty or we are deleting the
		// entire table by mistake. If you truly need to delete the entire table without a where
		// clause, $condition should be passed in as "   " (with some spaces).
		if ($condition == "")
		{
			return false;
		}
		$sql = "DELETE FROM $table WHERE $condition";
		$this->checkTranStatus();
		$this->queryDB($sql);
		return mysqli_affected_rows($this->conn) ;
	}
	
	
	/**
	 * Deletes rows from the table based on the SQL passed in.
	 *
	 * @param string $sql			SQL to use to delete the rows.
	 * @return int					number of rows deleted.
	 */
	public function deleteComplexSQL($sql)
	{
		$this->checkTranStatus();
		$result = $this->queryDB($sql);
		return mysqli_affected_rows($this->conn) ;
	}
	

	/**
	 * Issues a query to the Database. Does not handle any results. This should be used sparingly
	 * since the caller is responsible for handling or cleaning up the results.
	 *
	 * @param string $querystr	Query to be executed.
	 * @return boolean			TRUE on successful execution, FALSE on failure.
	 */
	public function queryDB($querystr, $fakeFlag = false)
	{
		if (empty($querystr))
		{
			return false;
		}
		
		

		// use for Debugging: $fakeFlag = TRUE ;
		
		if ($fakeFlag && strtoupper(substr(trim($querystr), 0, 6)) != "SELECT")
			return NULL;

		$result = mysqli_query($this->conn, $querystr);
		
		if (!$result)
		{			
			echo "Failed to Execute Query $querystr: " . mysqli_error($this->conn);
			return false;
		}

		return $result ;		
	}
	
	/**
	 * Issues a query to the Database. Does not handle any results. This should be used sparingly
	 * since the caller is responsible for handling or cleaning up the results.
	 *
	 * @param string $querystr	Query to be executed.
	 * @return boolean			TRUE on successful execution, FALSE on failure.
	 */
	public function execProcedure($host,$username,$password,$db,$querystr)
	{
		$conn = mysqli_connect($host, $username, $password);
		$db = mysqli_select_db($conn,$db);
		$res= mysqli_query($conn,$querystr);
		mysqli_commit($conn);
	}

	/**
	 * Builds the SQL string for an insert based on the parameters.
	 *
	 * @param string $table			name of the table
	 * @param array $columnnames	a simple array of column names
	 * @param array $rowvals		a simple array of column values (the order must match the column names array). Please note that datetime values are passed in as an associative array.
	 * @param array $types			a simple array of column types (in the same order). "string"/"datetime"/"int" are currently supported.
	 * @return string				the insert SQL String
	 */
	public function buildSingleInsertSQL($table, $columnnames, $rowvals)
	{			
		$rowvals	=	array(0 => $rowvals);	//	make it two dimensional array.
		return $this->buildMultipleInsertSQL($table, $columnnames, $rowvals);
	}
	
	/**
	 * Builds the SQL string for an multiple row insert based on the parameters.
	 *
	 * @param string $table				passing table name.
	 * @param arary $columnnames		passing a simple array column names.
	 * @param unknown_type $rowvals		passing complex array value lists.
	 * @return string $query			returns query string to insert into DB.			
	 */
	public function buildMultipleInsertSQL($table, $columnnames, $rowvals)
	{			
		
		$colnameslist	=	"(" . implode(",",$columnnames) . ")";
				
		for( $i = 0 ; $i < count($rowvals); $i++)
		{
			$inserValues	.=	"(";
			for( $k = 0; $k < count($rowvals[$i]); $k++ )
			{
				$inserValues	.=	$this->formatValue($rowvals[$i][$k]) . ",";
			}
			$inserValues	=	substr($inserValues,0,-1) . ") , ";
		}		
		
		return $querystr = "insert into " . $table . " " .  
								$colnameslist . " values " . substr($inserValues,0,-2);		
		
	}
	
	/**
	 * Build multiple update SQL array.
	 *
	 * @param string $table
	 * @param array $columnnames
	 * @param two dimensional array $rowvals
	 * @param array $conditions
	 * @return array update queries.
	 */
	public function buildMultipleUpdateSQL($table, $columnnames, $rowvals, $conditions)
	{
		$i = 0;
		foreach($conditions as $condition)
		{		
			$updateSQL[]	=	$this->buildUpdateSQL($table, $columnnames, $rowvals[$i], $condition);
			$i++;
		}
		return $updateSQL;
	}
	
	/**
	 * Build the SQL string for update based on the parameters passed.
	 *
	 * @param string $table				Table name for update.
	 * @param array $columnnames		Column names for update.
	 * @param array $rowvals			Columns values for update.
	 * @param string $condition			Condition to filter the records to update.
	 * @param boolean $ignoreFlag		Whether or not to add the IGNORE clause to the statement
	 * @return string update query.		Return the update sql query.
	 */
	public function buildUpdateSQL($table, $columnnames, $rowvals, $condition, $ignoreFlag = FALSE)
	{
		if(count($columnnames) != count($rowvals))
		{
			$numCols = count($columnnames);
			$numVals = count($rowvals);
			return false;
		}
		
		$ignoreClause = ($ignoreFlag) ? "IGNORE" : "" ;

		$updateQuery	=	"UPDATE $ignoreClause $table SET ";
		
		for( $i =0; $i < count($columnnames); $i++ )
		{
			$updateQuery	.=	$columnnames[$i] . " = " . $this->formatValue($rowvals[$i],"string") . " ," ;
		}
		
		return (substr($updateQuery,0,-1) . (($condition) ? " WHERE $condition" : ""));		
	}
	
	/**
	 * Build the SQL string for delete based on the parameters passed.
	 * @param string $table				Table name for delete.
	 * @param array $columnnames		Column names for delete.	 
	 * @param string $condition			Condition to filter the records to delete.
	 * @return string update query.		Return the delete sql query.
	*/
	public function buildDeleteSQL($table , $columnnames = '', $condition)
	{
		if(is_array($columnnames))	{	$columnslist	=	implode(",",$columnnames ); }
		return "DELETE " . $columnslist . " FROM $table WHERE " . $condition;
	}
	
	
	public function buildCondition($condition)
	{
		$numArgs = func_num_args();
		if ($numArgs == 1)
			return $condition ;

		// Get the variable number of args and remove the first one which is the
		// condition.
		$args = func_get_args() ;
		array_shift($args) ;
		
		foreach ($args as $value)
		{
			$formats[] = $this->formatValue($value);
		}
		
		$finalCondition = vsprintf($condition, $formats);
		
		return $finalCondition ;
	}
	
	/**
	 * returns the quote used by this database for quoting strings.
	 *
	 * @return char		character used to quote strings sent to the DB.
	 */
	public function quote()
	{
		return "'" ;
	}
	
	/**
	 * Formats a value such that it can be used in a SQL string. Essentially, this function should
	 * be used to quote values appropriately, as well as escape strings that need to be used in SQL statements.
	 * Across the project, we must use this function to format a column for a SQL String such that in future
	 * we can centralize SQL injection checks etc.
	 * Please note that if the type is datetime, this function expects an associative array such as follows:
	 * 		$date = array ("year" => 2007, "mon" = 10, "mday" = 9);
	 *
	 * @param mixed $columnValue	Value to be formatted
	 * @param string $type			one of string (default), datetime or int/any other
	 * @return string				a formatted string ready to be used in a SQL statement.
	 * 
	 * TBC (security) - Perform SQL injection checks.
	 */
	public function formatValue($columnValue, $type = "string")
	{
		if ($columnValue === NULL)
		{
			$formattedValue = 'NULL' ;
		}
		else
		{
			if (is_array($columnValue))
			{
				// That means the value is a list (passed in as an array). 
				// We must individually quote them and output as a comma separated list.
				$postVals = array();
				foreach ($columnValue as $preVal)
					$postVals[] = $this->formatValue($preVal, $type);
				$formattedValue = implode(',', $postVals) ;
			}
			else
			{
				switch($type)
				{
					case "string" :
						$formattedValue = $this->quote() . $this->escapeString($columnValue) . $this->quote() ;
						break ;
					case "datetime" :
						$formattedValue = sprintf("%s%d-%d-%d%s", $this->quote(),
										$columnValue["year"], $columnValue["mon"], $columnValue["mday"], $this->quote());
						break;
					default :
						$formattedValue = $columnValue ;
						break;
				}
			}
		}
		
		return $formattedValue ;
	}
	
	/**
	 * Escapes a given string for use within a SQL statement. Really meant to be used by the formatColumn() method
	 * of this class, however, available for use by external callers if the callers really want to format the
	 * value and build a SQL statement themselves (strongly discouraged).
	 *
	 * @param string $str	String to be escaped for use with the SQL statement.
	 * @return string		Escaped string.
	 */	
	public function escapeString($str)
	{
		return mysqli_real_escape_string($this->conn, $str) ;
	}
	

	/**
	 * Used by the data modifier methods (insert, update, delete), this method verifies
	 * whether autocommit is being attempted and if so, emits a warning in the log since
	 * we should generally avoid such direct updates outside a transaction.
	 *
	 */
	private function checkTranStatus()
	{
		if ($this->tranflag == FALSE && $this->autocommit == FALSE)
		{
			// We are not in the middle of a transaction. However, autocommit is set to FALSE.
			// We should generally avoid these autocommit inserts in the application.
			$this->setAutoCommitStatus(TRUE);
		}
		
		if ($this->autocommit == TRUE)
		{
			
		}
	}
	
	
	/**
	 * Builds a where clause from a list of conditions. Currently not ready for external use since it does not
	 * understand the type of the values - each value is assumed to be a string. Also the where clause is built
	 * by "AND" of all the conditions. This function may not be worth externalizing.
	 *
	 * @param array $conditions		An associative array of columnName => value
	 * @return string				a whereclause.
	 */
	private function whereClause($conditions)
	{
		if (!isset($conditions) || count($conditions) < 1)
			return "" ;
		
		$whereclause = "where " ;
		$count = 0 ;
		foreach ($conditions as $colname => $value)
		{
			if ($count > 0)
				$whereclause .= " AND " ;
			$whereclause .= $colname . "=" . $this->formatColumn($value) ;
			$count++;
		}
		
		return $whereclause ;
	}
	
	/**
	 * Returns the mysql database error when query exection gets fail. This is to log into the 
	 * Logger. Currently not being used.
	 * @return mysql error if any query fails.
	 */
	public function mysqlerror()
	{
		return mysqli_errno($this->conn);
	}
	
	

}

?>
